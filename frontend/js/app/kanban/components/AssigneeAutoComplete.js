import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import AvatarOption from './AvatarOption';
import AvatarTag from './AvatarTag';

const AssigneeAutoComplete = ({ controlId, dataTestId, members, assignee, setAssignee }) => {
  return (
    <Autocomplete
      multiple
      openOnFocus
      filterSelectedOptions
      disableClearable
      disableCloseOnSelect
      id={controlId}
      data-testid={dataTestId}
      size="small"
      options={members}
      getOptionLabel={(option) => option.email}
      value={assignee}
      onChange={(_event, value) => setAssignee(value)}
      renderOption={(option) => <AvatarOption option={option} />}
      renderInput={(params) => (
        <TextField {...params} autoFocus label="Assignees" variant="outlined" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <AvatarTag key={option.id} option={option} {...getTagProps({ index })} />
        ))
      }
    />
  );
};

export default AssigneeAutoComplete;
