import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

function handleClick(e, data, target) {
  console.log(e);
  console.log(data);
  console.log(target);
}

export function gridItemCM(editF, deleteF) {
  return (
    <ContextMenu id="grid-item">
      <MenuItem data={{ action: 'edit' }} onClick={editF || handleClick}>
        Edit
      </MenuItem>
      <MenuItem data={{ action: 'delete' }} onClick={deleteF || handleClick}>
        Delete
      </MenuItem>
    </ContextMenu>
  );
}

// <MenuItem divider />
