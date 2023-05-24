import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';

import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styles from './Menu.module.css';
import { Fragment } from "react";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const { t } = useTranslation('menu');
  const navigateTo = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles['Menu-component']}>
      <Row>
        <Col md={2}>
          <MenuIcon
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="text"
            onClick={handleClick}
            endicon={<KeyboardArrowDownIcon />}
            style={{cursor:'pointer'}}
          />
          {/* <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            style={{fontWeight:'bold', color: 'black'}}
          >
            {t('label')}
          </Button> */}
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => {
              handleClose(); navigateTo('/');
            }} disableRipple>
              🏠 {t('mainPage')}
            </MenuItem>
            <MenuItem onClick={() => {
              handleClose(); navigateTo('/team/create');
            }} disableRipple>
              🔰 {t('teamCreate')}
            </MenuItem>
            <MenuItem onClick={() => {
              handleClose(); navigateTo('/team/sell');
            }} disableRipple>
              💲 {t('teamSell')}
            </MenuItem>
          </StyledMenu>
        </Col>
      </Row>
    </div>
  );
}


// const Menu = ({ }) => {
//   const { t } = useTranslation('menu');

//   return (
//     <div className={styles['Menu-component']}>
//       <Row>
//         <Col className={styles.col}><Link to='/'>🏠 {t('mainPage')}</Link></Col>
//         <Col className={styles.col}><Link to='/team/create'>🔰 {t('teamCreate')}</Link></Col>
//         <Col className={styles.col}><Link to='/team/sell'>💲 {t('teamSell')}</Link></Col>
//       </Row>
//     </div>
//   );
// }

// export default Menu;