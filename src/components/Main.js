import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import LogoComponent from '../subComponents/LogoComponent'
import PowerButton from '../subComponents/PowerButton'
import SocialIcons from '../subComponents/SocialIcons'
import { YinYang } from './AllSvgs'
import Intro from './Intro'

const MainContainer = styled.div`
  background: ${props => props.theme.body};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  h2, h3, h4, h5, h6 {
    font-family: 'Karla', sans-serif;
    font-weight: 500;
  }
`

const Container = styled.div`
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const Contact = styled.a`
  color: ${props => props.theme.text};
  position: absolute;
  top: 2rem;
  right: calc(1rem + 2vw);
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    h2 { font-size: 0.78rem; }
  }
`

const BLOG = styled(NavLink)`
  color: ${props => props.theme.text};
  position: absolute;
  top: 50%;
  right: calc(1rem + 2vw);
  transform: rotate(90deg) translate(-50%, -50%);
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    top: unset;
    bottom: 5rem;
    right: 1rem;
    transform: none;

    h2 { font-size: 0.78rem; }
  }
`

const Project = styled(NavLink)`
  color: ${props => props.click ? props.theme.body : props.theme.text};
  position: absolute;
  top: 50%;
  left: calc(1rem + 2vw);
  transform: translate(-50%, -50%) rotate(-90deg);
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    top: unset;
    bottom: 5rem;
    left: 1rem;
    transform: none;

    h2 { font-size: 0.78rem; }
  }
`

const BottomBar = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;

  @media (max-width: 480px) {
    bottom: 1.5rem;
    justify-content: center;
    gap: 1.5rem;
  }
`

const ABOUT = styled(NavLink)`
  color: ${props => props.click ? props.theme.body : props.theme.text};
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    h2 { font-size: 0.78rem; }
  }
`

const SKILLS = styled(NavLink)`
  color: ${props => props.theme.text};
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    h2 { font-size: 0.78rem; }
  }
`

const Resume = styled(NavLink)`
  color: ${props => props.click ? props.theme.body : props.theme.text};
  text-decoration: none;
  z-index: 1;

  h2 {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
  }

  @media (max-width: 480px) {
    h2 { font-size: 0.78rem; }
  }
`

const rotate = keyframes`
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
`

const Center = styled.button`
  position: absolute;
  top: ${props => props.click ? '85%' : '50%'};
  left: ${props => props.click ? '92%' : '50%'};
  transform: translate(-50%, -50%);
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 1s ease;

  & > :first-child {
    animation: ${rotate} infinite 1.5s linear;
  }

  & > :last-child {
    display: ${props => props.click ? 'none' : 'inline-block'};
    padding-top: 0.75rem;
    font-size: clamp(0.6rem, 1.5vw, 0.85rem);
  }

  @media (max-width: 480px) {
    top: ${props => props.click ? '85%' : '45%'};
    left: ${props => props.click ? '88%' : '50%'};
  }
`

const DarkDiv = styled.div`
  position: absolute;
  top: 0;
  background-color: #000;
  bottom: 0;
  right: 50%;
  width: ${props => props.click ? '50%' : '0%'};
  height: ${props => props.click ? '100%' : '0%'};
  z-index: 1;
  transition: height 0.5s ease, width 1s ease 0.5s;
`

const Main = () => {
  const [click, setClick] = useState(false)
  const handleClick = () => setClick(!click)

  // Responsive icon size — reduced across all breakpoints
  const iconSize = typeof window !== 'undefined' && window.innerWidth <= 480
    ? (click ? 55 : 80)
    : (click ? 90 : 150)

  return (
    <MainContainer>
      <DarkDiv click={click} />
      <Container>
        <PowerButton />
        <LogoComponent theme={click ? 'dark' : 'light'} />
        <SocialIcons theme={click ? 'dark' : 'light'} />

        <Center click={click}>
          <YinYang
            onClick={handleClick}
            width={iconSize}
            height={iconSize}
            fill='currentColor'
          />
          <span>click here</span>
        </Center>

        <Contact target="_blank" href="mailto:ranjithaseenivasan2004@gmail.com">
          <motion.h2
            initial={{ y: -200, transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            animate={{ y: 0,    transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Say hi..
          </motion.h2>
        </Contact>

        <BLOG to="/feats">
          <motion.h2
            initial={{ y: -200, transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            animate={{ y: 0,    transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            CERTs.
          </motion.h2>
        </BLOG>

        <Project to="/projects" click={click}>
          <motion.h2
            initial={{ y: -200, transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            animate={{ y: 0,    transition: { type: 'spring', duration: 1.5, delay: 1 } }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            PROJECTS.
          </motion.h2>
        </Project>

        <BottomBar>
          <Resume to="/resume" click={click}>
            <motion.h2
              initial={{ y: 200, transition: { type: 'spring', duration: 1.5, delay: 1 } }}
              animate={{ y: 0,   transition: { type: 'spring', duration: 1.5, delay: 1 } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              RESUME.
            </motion.h2>
          </Resume>

          <SKILLS to="/skills">
            <motion.h2
              initial={{ y: 200, transition: { type: 'spring', duration: 1.5, delay: 1 } }}
              animate={{ y: 0,   transition: { type: 'spring', duration: 1.5, delay: 1 } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              MY SKILLS.
            </motion.h2>
          </SKILLS>
        </BottomBar>
      </Container>

      {click ? <Intro click={click} /> : null}
    </MainContainer>
  )
}

export default Main