import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";
import useStyles from "../../styles";

import EditIcon from '@material-ui/icons/Edit';

const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

export default function TableComponent({ data,onclick }) {
  const classes = useStyles();
  
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ id, name,   status }) => (
          <TableRow key={id}>
            <TableCell className="pl-3 fw-normal">{name}</TableCell>
        
            <TableCell>
              <Chip label={status} classes={{root: classes[states[status.toLowerCase()]]}}/>
            </TableCell>
            <TableCell>
              <EditIcon onClick={() => onclick()}/>
            </TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
