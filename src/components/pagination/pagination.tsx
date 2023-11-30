import { Pagination, Stack } from '@mui/material';
import React from 'react'

export interface PaginationProps {
    currentPage: number,
    totalPage: number,
    onChange: (e: React.ChangeEvent<unknown>, page: number) => void;
}


const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPage, onChange }) => {
    return (
        <Stack>
            <Pagination
                count={totalPage}
                page={currentPage}
                color="primary"
                onChange={onChange}
            />
        </Stack>
    )
}

export default PaginationComponent;