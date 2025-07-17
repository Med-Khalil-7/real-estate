import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDebounce } from 'use-debounce';
import AvatarTag from './AvatarTag';
import AvatarOption from './AvatarOption';
import { css } from '@emotion/core';
import { API_SEARCH_USERS } from '../../../constants/api';
import api from '../../../api';
const UserSearch = ({ boardId, tagsValue, setTagsValue }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [debouncedInput] = useDebounce(inputValue, 300, {
    equalityFn: (a, b) => a === b,
  });

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api(`${API_SEARCH_USERS}?board=${boardId}&search=${inputValue}`);
        setLoading(false);
        setOptions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (inputValue === '') {
      setLoading(false);
      setOptions([]);
    } else {
      fetchData();
    }
  }, [debouncedInput, tagsValue]);

  useEffect(() => {
    if (debouncedInput === inputValue) {
      setLoading(false);
    }
  }, [debouncedInput, inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTagsChange = (_event, newValues) => {
    setTagsValue(newValues);
    setOptions([]);
  };

  return (
    <Autocomplete
      multiple
      id="user-search"
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionSelected={(option, value) => option.email === value.email}
      getOptionLabel={(option) => option.email}
      filterSelectedOptions
      onChange={handleTagsChange}
      options={options}
      loading={loading}
      value={tagsValue}
      renderOption={(option) => <AvatarOption option={option} />}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          label="Search email"
          variant="outlined"
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <AvatarTag key={option.id} option={option} {...getTagProps({ index })} />
        ))
      }
      css={css`
        width: ${theme.breakpoints.down('xs') ? 200 : 300}px;
      `}
    />
  );
};

export default UserSearch;
