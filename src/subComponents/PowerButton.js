// Home button

import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { PowerBtn } from '../components/AllSvgs'
import { DarkTheme } from '../components/Themes'


const Power = styled.button`
position: fixed;
top: 2rem;
left: 50%;
transform: translate(-50%, 0);
background-color: ${props => props.color === 'dark' ? DarkTheme.body : DarkTheme.text};
color: ${props => props.color === 'dark' ? DarkTheme.text : DarkTheme.body};
padding: 0.3rem;
border-radius: 50%;
border: 1px solid #000;
width: 2.5rem;
height: 2.5rem;

display: flex;
justify-content: center;
align-items:center;
z-index:10000;

cursor: pointer;

&:hover{
    transform: translate(-50%, 0) scale(1.1);
    transition: all 0.2s ease;
}

&>*:first-child{
    text-decoration: none;
    color: inherit;
}
`

const PowerButton = () => {
    return (
        <Power>
        <NavLink to="/">
        <PowerBtn width={30} height={30} fill='currentColor' />
        </NavLink>
        </Power>
    )
}

export default PowerButton
