from datetime import date


class TimeInterval(object):
    start = None
    end = None

    def __init__(self, start, end):
        assert start is None or isinstance(start, date), "start should be a date instance"
        assert end is None or isinstance(end, date), "end should be a date instance"
        self.start = start
        self.end = end


def month_interval(start, end):
    """
    get total
    :param start:
    :type start:
    :param end:
    :type end:
    :return:
    :rtype:
    """
    return (start.year - end.year) * 12 + start.month - end.month
