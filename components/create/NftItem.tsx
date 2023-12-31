import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  Link,
  Icon,
  IconButton,
  useTheme,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Collapse,
  Skeleton
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { ITraitsData, INftData, IRoyaltyItem } from '@components/create/TokenDetailsForm';
import RoyaltySection from '@components/create/RoyaltySection';
import { IRarityData } from '@pages/mint';

interface INftItemProps {
  rarityData: IRarityData[];
  traitData: ITraitsData[];
  nftData: INftData[];
  setNftData: React.Dispatch<React.SetStateAction<INftData[]>>;
  setUnbouncedData: React.Dispatch<React.SetStateAction<INftData[]>>;
  nftImageUrls: { [key: string]: string };
  setNftImageUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  index: number;
  id: string;
  royaltyData: IRoyaltyItem[];
  fungible: boolean;
  skeleton: boolean;
  setSkeleton: React.Dispatch<React.SetStateAction<boolean>>
  tokenFormValidation: {
    name: boolean;
    rarity: boolean;
  }[];
  setTokenFormValidation: React.Dispatch<React.SetStateAction<{
    name: boolean;
    rarity: boolean;
  }[]>>;
}

const NftItem: FC<INftItemProps> = (
  {
    rarityData,
    traitData,
    nftData,
    setNftData,
    setUnbouncedData,
    nftImageUrls,
    setNftImageUrls,
    index,
    id,
    royaltyData,
    fungible,
    skeleton,
    setSkeleton,
    tokenFormValidation,
    setTokenFormValidation
  }
) => {
  const theme = useTheme()
  const [checkMax, setCheckMax] = useState<{ [key: string]: boolean }>({})
  const [thisNft, setThisNft] = useState<INftData>(nftData[index])
  const [royaltyToggle, setRoyaltyToggle] = useState(false)
  const [raritySelect, setRaritySelect] = useState('')

  const handleRoyaltyToggle = () => {
    setThisNft(prev => ({
      ...prev,
      royalties: royaltyToggle === true ? royaltyData : customRoyalties,
      royaltyLocked: !royaltyToggle
    }))
    setRoyaltyToggle(!royaltyToggle);
  };
  const [customRoyalties, setCustomRoyalties] = useState<IRoyaltyItem[]>([{
    address: '',
    pct: 0,
    id: uuidv4()
  }])

  useEffect(() => {
    if (thisNft.traits &&
      thisNft.traits.every((trait, i) => traitData[i]?.traitName === trait.key)) {
      setThisNft(prev => (
        {
          ...prev,
          traits: traitData.map((item, i) => {
            const matched = prev.traits?.filter((trait) => trait.id === item.id)
            if (matched && matched.length === 1) {
              if (item.max && item.max < Number(matched[0].value)) {
                setCheckMax(prev => ({ // used for form errors
                  ...prev,
                  [item.id]: false
                }))
              }
              return (
                {
                  key: item.traitName,
                  value: (item.max && item.max < Number(matched[0].value)) ? item.max.toString() : matched[0].value,
                  type: item.type,
                  id: item.id,
                  max: item.max ? item.max : undefined
                }
              )
            }
            else if (prev.traits !== undefined && prev.traits[i] !== undefined) {
              return (prev.traits[i])
            }
            else return {
              key: item.traitName,
              value: '',
              type: item.type,
              id: item.id,
              max: item.max ? item.max : undefined
            }
          })
        }
      ))
    }
  }, [traitData])

  useEffect(() => {
    const filter = rarityData.filter((data) => data.rarity === raritySelect)
    if (filter.length !== 1) {
      setRaritySelect('')
      setThisNft(prev => ({
        ...prev,
        rarity: ''
      }))
    }
  }, [rarityData])

  useEffect(() => {
    if (royaltyToggle === true && thisNft.royalties !== customRoyalties) {
      setThisNft(prev => ({
        ...prev,
        royalties: customRoyalties
      }))
    }
  }, [customRoyalties])

  useEffect(() => {
    setThisNft(nftData[index])
    setRoyaltyToggle(nftData[index].royaltyLocked)
    // @ts-ignore
    nftData[index].rarity !== undefined && setRaritySelect(nftData[index].rarity)
    // @ts-ignore
    nftData[index].royalties !== undefined && setCustomRoyalties(nftData[index].royalties)
  }, [id])

  useEffect(() => {
    if (nftData[index].royaltyLocked === false && nftData[index].royalties !== thisNft.royalties) {
      setThisNft(prev => ({
        ...prev,
        royalties: nftData[index].royalties,
        royaltyLocked: false
      }))
      setRoyaltyToggle(false)
    }
  }, [nftData[index]?.royaltyLocked])

  // useEffect(() => {
  //   setUpdateBlocker(true)
  //   setThisNft(nftData[index])
  //   setRoyaltyToggle(nftData[index].royaltyLocked)
  //   // @ts-ignore
  //   nftData[index].royalties !== undefined && setCustomRoyalties(nftData[index].royalties)
  // }, [JSON.stringify(nftData[index])])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (JSON.stringify(nftData[index]) !== JSON.stringify(thisNft)) {
        setNftData((prevArray) => {
          const newArray = prevArray.map((item, i) => {
            if (index === i) {
              return thisNft
            }
            return item
          })
          return newArray
        })
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(thisNft)])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'nftName' && e.target.value !== '') {
      setTokenFormValidation((prev) =>
        prev.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              name: false
            };
          }
          return item;
        })
      );
    }
    setThisNft(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeTrait = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setThisNft(prev => ({
      ...prev,
      traits: prev.traits?.map((item, i) => {
        if (e.target.name === item.key) {
          const filteredTraits = traitData.filter((trait) => trait.id === item.id)
          let newValue = e.target.value
          if (filteredTraits.length < 2 && filteredTraits[0] !== undefined && filteredTraits[0].max && Number(newValue) > filteredTraits[0].max) {
            setCheckMax(prev => ({
              ...prev,
              [item.id]: true
            }))
          }
          else {
            setCheckMax(prev => ({
              ...prev,
              [item.id]: false
            }))
          }
          return (
            {
              ...item,
              value: newValue
            }
          )
        }
        else return item
      })
    }))
  }

  const handleExplicitCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThisNft(prev => ({
      ...prev,
      explicit: e.target.checked
    }))
  }

  const handleRarityChange = (e: SelectChangeEvent) => {
    setRaritySelect(e.target.value)
    if (e.target.value !== '') {
      setTokenFormValidation((prev) =>
        prev.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              rarity: false
            };
          }
          return item;
        })
      );
    }
    setThisNft(prev => ({
      ...prev,
      rarity: e.target.value
    }))
  }

  const removeItem = () => {
    setSkeleton(true)
    setNftImageUrls(prev => {
      const state = { ...prev };
      delete state[id]
      return state;
    })
    setNftData(current => current.filter((item, idx) => item.id !== id))
    setUnbouncedData(current => current.filter((item, idx) => item.id !== id))
  }

  return (
    <Box sx={{ position: 'relative', display: 'block', p: 1, background: theme.palette.divider, mb: 2, borderRadius: '6px' }} key={index}>
      <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="center">
        <Grid item xs={12} sm={3}>
          {skeleton ? (
            <Skeleton variant="rounded" width={'100%'} height={300} />
          ) : (
            <img
              src={nftImageUrls[id]}
              alt="NFT Preview Image"
              width="100%"
              style={{
                borderRadius: '8px',
              }}
              crossOrigin="anonymous"
            />
          )}


        </Grid>
        <Grid item xs={12} sm={9}>
          {skeleton ? (
            <Skeleton variant="rounded" width={'100%'} height={300} />
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                >
                  <Grid item xs>
                    <TextField
                      fullWidth
                      variant="filled"
                      id="nft-name"
                      name="nftName"
                      label="Name"
                      value={thisNft.nftName}
                      onChange={handleChange}
                      error={tokenFormValidation[index].name}
                      helperText={tokenFormValidation[index].name ? "Name the token" : null}
                    />
                  </Grid>
                  {fungible && (
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="quantity"
                        name="qty"
                        label="Quantity"
                        value={thisNft.qty}
                        onChange={handleChange}
                      />
                    </Grid>
                  )}
                  <Grid item xs="auto">
                    <IconButton onClick={() => {
                      removeItem()
                    }}>
                      <Icon>
                        delete
                      </Icon>
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item key={index} xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  id="nft-description"
                  name="description"
                  label="Description"
                  value={thisNft.description}
                  onChange={handleChange}
                />
              </Grid>
              {(rarityData.length > 1 || rarityData[0].rarity.length > 0) && (
                <Grid item xs={6}>
                  <FormControl
                    variant="filled"
                    fullWidth
                    error={tokenFormValidation[index].rarity}
                  >
                    <InputLabel id="rarity-label">Rarity</InputLabel>
                    <Select
                      id="rarity"
                      value={raritySelect}
                      label="Rarity"
                      name="rarity"
                      onChange={handleRarityChange}
                    >
                      {rarityData.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.rarity}>{item.rarity}</MenuItem>
                        )
                      })}
                    </Select>
                    {tokenFormValidation[index].rarity &&
                      <FormHelperText>Choose a rarity</FormHelperText>
                    }
                  </FormControl>
                </Grid>
              )}

              {thisNft.traits && thisNft.traits[0].key !== '' && (
                thisNft.traits.map((item, i) => {
                  return (
                    <Grid item key={i} xs={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="trait-value"
                        label={item.key}
                        type={item.type === 'Level' || item.type === 'Stat' ? 'number' : ''}
                        value={item.value}
                        name={item.key}
                        onChange={handleChangeTrait}
                        error={checkMax[item.id]}
                        helperText={checkMax[item.id] ? 'Keep numbers below trait max' : ''}
                      />
                    </Grid>
                  )
                })
              )}
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  sx={{
                    width: '100%',
                    mb: '0px',
                  }}
                >
                  <Grid item xs>
                    <FormControl sx={{ pl: '8px', color: theme.palette.text.secondary }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={thisNft.explicit}
                            onChange={handleExplicitCheckbox}
                          />
                        }
                        label="Contains explicit content"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs="auto">
                    <Box onClick={() => handleRoyaltyToggle()} sx={{ '&:hover': { cursor: 'pointer' } }}>
                      <Typography
                        sx={{
                          display: 'inline-block',
                          mr: '6px',
                          verticalAlign: 'middle',
                          color: royaltyToggle ? theme.palette.text.primary : theme.palette.text.secondary
                        }}
                      >
                        Custom Royalties
                      </Typography>
                      <Switch
                        focusVisibleClassName=".Mui-focusVisible"
                        disableRipple
                        checked={royaltyToggle}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Collapse in={royaltyToggle} sx={{ pl: '8px', width: '100%' }}>
                <RoyaltySection
                  data={customRoyalties}
                  setData={setCustomRoyalties}
                />
              </Collapse>

              <Button onClick={() => {
                console.log(thisNft)
              }}>
                console log this nft
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftItem;