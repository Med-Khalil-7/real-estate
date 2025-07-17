from django.contrib.auth import get_user_model

from api.users.serializers import UserSerializer
from core.models import Board, Column, Comment, Task
from rest_framework import serializers


User = get_user_model()


class BoardModelSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if self.context["request"].user not in validated_data["board"].members.all():
            raise serializers.ValidationError("Must be a member of the board!")
        return super().create(validated_data)


class BoardSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    members = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        extra_kwargs = {"created": {"read_only": True}, "members": {"read_only": True}}
        model = Board
        fields = ["id", "name", "description", "owner", "created", "members"]


class TaskSerializer(serializers.ModelSerializer):
    column = serializers.PrimaryKeyRelatedField(queryset=Column.objects.all())

    assignees = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    def extra_validation(self, board=None, assignees=None, user=None):
        if assignees and board:
            for assignee in assignees:
                if assignee not in board.members.all():
                    raise serializers.ValidationError(
                        "Can't assign someone who isn't a board member!"
                    )
        if user and user not in board.members.all():
            raise serializers.ValidationError("Must be a member of the board!")

    def update(self, instance, validated_data):
        assignees = validated_data.get("assignees")
        board = instance.column.board
        self.extra_validation(board=board, assignees=assignees)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = self.context["request"].user
        board = validated_data["column"].board
        assignees = validated_data["assignees"]
        self.extra_validation(board=board, assignees=assignees, user=user)
        return super().create(validated_data)

    class Meta:
        model = Task
        fields = [
            "id",
            "created",
            "modified",
            "title",
            "description",
            "priority",
            "assignees",
            "task_order",
            "column",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "task", "author", "text", "created", "modified"]


class ColumnSerializer(BoardModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "title", "tasks", "column_order", "board"]


class BoardDetailSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    columns = ColumnSerializer(many=True, read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "owner", "members", "columns", "description", "created"]


class MemberSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
