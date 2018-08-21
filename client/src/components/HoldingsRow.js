import React from 'react';
import {Table} from 'semantic-ui-react'

const HoldingsRow = (props) => {
    return (
        <Table.Row>
            <Table.Cell>{props.currency}</Table.Cell>
            <Table.Cell textAlign='right'>{props.quantity}</Table.Cell>
            <Table.Cell textAlign='right' color='green'>${props.price}</Table.Cell>
        </Table.Row>
    );
};


export default HoldingsRow;