import React, { useEffect, useState } from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import { DarkTheme, lightTheme } from './Themes'
import LogoComponent from '../subComponents/LogoComponent'
import SocialIcons from '../subComponents/SocialIcons'
import PowerButton from '../subComponents/PowerButton'
import { Blogs } from '../data/BlogData'
import BlogComponent from './BlogComponent'
import AnchorComponent from '../subComponents/Anchor'
import BigTitle from "../subComponents/BigTitlte"
import { motion } from 'framer-motion'

// ── Keyframes ─────────────────────────────────────────────────────────────────
const gridMove = keyframes`
  from { background-position: 0 0; }
  to   { background-position: 60px 60px; }
`
const pageScan = keyframes`
  from { transform: translateY(-100%); }
  to   { transform: translateY(100vh); }
`
const particleDrift = keyframes`
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(-105vh) translateX(30px); opacity: 0; }
`
const twinkle = keyframes`
  0%, 100% { opacity: 0.2; box-shadow: 0 0 4px #fff; }
  50%       { opacity: 1;   box-shadow: 0 0 14px #fff, 0 0 28px rgba(255,255,255,0.4); }
`

// ── Styled Components ─────────────────────────────────────────────────────────
const MainContainer = styled(motion.div)`
  background-color: ${p => p.theme.body};
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(172,199,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(172,199,180,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: ${gridMove} 10s linear infinite;
    pointer-events: none; z-index: 0;
  }
  &::after {
    content: ''; position: fixed; left: 0; top: 0; width: 100%; height: 160px;
    background: linear-gradient(transparent, rgba(172,199,180,0.025), transparent);
    animation: ${pageScan} 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
`

const Container = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  padding-bottom: 5rem;
`

const Vignette = styled.div`
  position: fixed; inset: 0;
  background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.88) 100%);
  pointer-events: none; z-index: 2;
`

const Particle = styled.div`
  position: fixed; bottom: -10px; left: ${p => p.$left}%;
  width: ${p => p.$size}px; height: ${p => p.$size}px;
  border-radius: 50%; background: ${p => p.$color};
  animation:
    ${particleDrift} ${p => p.$dur}s linear infinite,
    ${twinkle} ${p => p.$twinkDur}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s, ${p => p.$delay * 0.5}s;
  pointer-events: none; z-index: 3;
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10rem;
`

// ── 1 column, bigger card ─────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(calc(18rem + 20vw), 1fr));
  grid-gap: calc(1rem + 2vw);
  position: relative;
  z-index: 10;
`

// ── Particles data ────────────────────────────────────────────────────────────
const COLORS = ['#ffffff', '#e8e0ff', '#c4b5fd', '#a78bfa', '#d4e4ff']
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  dur: Math.random() * 12 + 8,
  twinkDur: Math.random() * 3 + 2,
  delay: -(Math.random() * 20),
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
}))

// ── Framer motion config ──────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.5, duration: 0.5 }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const BlogPage = () => {
  const [numbers, setNumbers] = useState(0)

  useEffect(() => {
    let num = (window.innerHeight - 70) / 30
    setNumbers(parseInt(num))
  }, [])

  return (
    <ThemeProvider theme={DarkTheme}>
      <MainContainer
        variants={container}
        initial='hidden'
        animate='show'
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <Vignette />
        {PARTICLES.map(p => (
          <Particle
            key={p.id}
            $left={p.left} $size={p.size} $dur={p.dur}
            $delay={p.delay} $twinkDur={p.twinkDur} $color={p.color}
          />
        ))}

        <Container>
          <LogoComponent theme='dark' />
          <PowerButton />
          <SocialIcons theme='dark' />
          <AnchorComponent number={numbers} />

          <Center>
            <Grid>
              <ThemeProvider theme={lightTheme}>
                {Blogs.map(blog => (
                  <BlogComponent key={blog.id} blog={blog} />
                ))}
              </ThemeProvider>
            </Grid>
          </Center>

          <BigTitle text="CERTIFICATES" top="5rem" left="5rem" />
        </Container>
      </MainContainer>
    </ThemeProvider>
  )
}

export default BlogPage