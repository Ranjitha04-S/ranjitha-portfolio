import React from 'react'
import styled from 'styled-components'
import profile from '../assets/Images/profile-img.png'
import { motion } from 'framer-motion'

const Box = styled(motion.div)`
    position : absolute;
    top : 50%;
    left : 50%;
    transform : translate(-50%, -50%);
    margin : 0;

    width : 60vw;
    height : 55vh;
    display : flex;

    background : linear-gradient(
        to right,
        ${props => props.theme.body} 50%,
        ${props => props.theme.text} 50%) bottom,
        linear-gradient(
        to right,
        ${props => props.theme.body} 50%,
        ${props => props.theme.text} 50%) top;
        background-repeat : no-repeat;
        background-size : 100% 2px;
        border-left : 2px solid ${props => props.theme.body};
        border-right : 2px solid ${props => props.theme.text};

        z-index : 1;

    @media (max-width: 768px) {
        width: 72vw;
        height: 65vh;
    }

    @media (max-width: 480px) {
        width: 82vw;
        height: 72vh;
        top: 50%;
    }
`

const SubBox = styled.div`
    width : 50%;
    position : relative;    
    display : flex;

    .pic{
        position : absolute;
        bottom : 0;
        left : 50%;
        transform : translate(-50%, 0%);
        width : 90%;
        height : 120%;
    }
`

const Text = styled.div`
    font-size : calc(1.3rem + 1vw);
    color : ${props => props.theme.body}; 
    padding : 2rem;
    cursor : pointer;
    position : relative;

    display : flex;
    flex-direction : column;
    justify-content : space-evenly;
    gap : 0 !important;

    & > *:last-child{
        color : ${props => 
            `rgba(${props.theme.bodyR}, ${props.theme.bodyG}, ${props.theme.bodyB}, 0.6)`};
        font-size : calc(0.3rem + 1vw);
        font-weight : 300;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;

        h1 { font-size: clamp(1.3rem, 3vw, 2rem); }
        h3 { font-size: clamp(0.9rem, 2.2vw, 1.4rem); }

        & > *:last-child {
            font-size: clamp(0.6rem, 1.6vw, 0.85rem);
            line-height: 1.6;
        }
    }

    @media (max-width: 480px) {
        padding: 1.2rem;

        h1 { font-size: clamp(1.1rem, 4vw, 1.5rem); }
        h3 { font-size: clamp(0.8rem, 3vw, 1.1rem); }

        & > *:last-child {
            font-size: clamp(0.58rem, 2.2vw, 0.75rem);
            line-height: 1.6;
        }
    }
`

const Intro = () => {
    return (
        <Box
            initial={{ height: 0 }}
            animate={{ height: '55vh' }}
            transition={{ type: 'spring', duration: 2, delay: 1 }}
        >
            <SubBox>
                <Text>
                    <h1 style={{margin:3}}>Hi,</h1>
                    <h3 style={{margin:3}}>I'm Ranjitha Seenivasan!</h3>
                    <h6 style={{margin:3}}>
                        A highly motivated, detail-oriented developer with a strong passion for building scalable web applications and solving real-world problems. Adaptable, goal-driven, and continuously learning, with a focus on clean code, performance, and user-centric design.
                    </h6>
                </Text>
            </SubBox>
            <SubBox>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    <img className='pic' src={profile} alt="Profile Pic" />
                </motion.div>
            </SubBox>
        </Box>
    )
}

export default Intro