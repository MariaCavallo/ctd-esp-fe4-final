import * as React from 'react';
import {FC} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from 'next/link'
import {Link as MUILink} from '@mui/material';
import Image from 'next/image';

type Props = {
    variant?: "simple" | "general"
}

const Header: FC<Props> = ({variant}: Props) => {
    return <Container maxWidth="xl">
        <Toolbar disableGutters sx={{display: "flex", justifyContent: "space-between"}}>
            <Link href="/">
                <Box sx={{display: "flex", alignContent: "center", alignItems: "center", cursor: "pointer"}}>
                    <MUILink variant="h6" sx={{ mr: 1, fontWeight: 700, color: 'inherit', textDecoration: 'none'}}> DH -</MUILink>
                    <Image src="/marvel-logo.png" alt='Logo Marvel' height={50} width={100}/>
                </Box>
            </Link>
            {variant == 'general' &&
                <Box>
                    <Link href="/preguntas-frecuentes">
                        <MUILink variant="body2" sx={{ cursor: "pointer", color: 'white', fontSize: 18, fontWeight: 600}}>FAQ</MUILink>
                    </Link>
                </Box>
            }
        </Toolbar>
    </Container>
}


const GeneralHeader: FC<Props> = ({variant}: Props) => {
    return variant == 'general' ?
        <AppBar position="static">
            <Header variant={variant}/>
        </AppBar> : <Header variant={variant}/>
        ;
};
GeneralHeader.defaultProps = {
    variant: 'general'
}

export default GeneralHeader;
