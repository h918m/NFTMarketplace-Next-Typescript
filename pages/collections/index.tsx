import { FC, useMemo } from 'react'
import type { NextPage } from 'next'
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material'
import Image from 'next/image'
import NextLink from 'next/link'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const collections = [
  {
    imgUrl: '/images/cube1.png',
    logoUrl: '/images/ergopad-circle-logo.png',
    title: 'Genesis',
    artist: 'Ergopad',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.',
    link: '/collections/genesis',
  },
  {
    imgUrl: '/images/nft-cube.png',
    logoUrl: '/images/paideia-circle-logo.png',
    title: 'Wrath of the Gods',
    artist: 'Paideia',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum.',
    link: '/collections/wrath-of-the-gods',
  },
  {
    title: 'Placeholder Title',
    artist: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum.',
    link: '/collections/placeholder',
  },
]

interface ICollectionProps {
  imgUrl?: string;
  logoUrl?: string;
  title: string;
  artist: string;
  description: string;
  link: string;
}

const Collection: FC<ICollectionProps> = (props) => {
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  return (
    <>
      <Grid container spacing={3} alignItems="center" sx={{ mb: '32px' }}>
        <Grid item sm={6} xs={12}>
          <Box
            sx={{
              position: 'relative',
              background: '#000',
              height: '320px',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={props.imgUrl ? props.imgUrl : `/images/placeholder/${rand}.jpg`}
              layout="fill"
              objectFit="cover"
            />
          </Box>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box
            sx={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                mb: '24px'
              }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  mr: '8px',
                  height: '32px',
                  width: '32px',
                  borderRadius: "32px",
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={props.logoUrl ? props.logoUrl : `/images/placeholder/${rand}.jpg`}
                  layout="fixed"
                  height={32}
                  width={32}
                />
              </Box>
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  display: 'inline-block',
                }}
              >
                By {props.artist}
              </Typography>
            </Box>
            <Typography variant="h5">
              {props.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: '32px',
                lineHeight: '1.5',
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
              }}
            >
              {props.description}
            </Typography>
            <ButtonLink href={props.link} endIcon={<ArrowForwardIcon />}>
              Explore collection
            </ButtonLink>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ mb: '32px' }} />
    </>
  )
}

const Collections: NextPage = () => {
  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h1">
        Collections
      </Typography>
      <Typography variant="body2" sx={{ mb: '48px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.
      </Typography>
      {collections.map((props) => {
        return (
          <Collection
            imgUrl={props.imgUrl}
            logoUrl={props.logoUrl}
            title={props.title}
            artist={props.artist}
            description={props.description}
            link={props.link}
          />
        )
      })}
    </Container>
  )
}

export default Collections