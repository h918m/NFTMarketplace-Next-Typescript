import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import RaritySection from '@components/create/RaritySection'
import TraitSection from '@components/create/TraitSection';
import { IRarityData } from '@pages/mint';
import NftSection from '@components/create/NftSection';
import { ITokenDetailsData, tokenDetailsDataInit } from '@pages/mint';

export interface ITraitsData {
  traitName: string; // the name of the trait type (eg: sex, speed, age)
  id: string;
  type: 'Property' | 'Level' | 'Stat';
  max?: number; // if trait is a Level or Stat, this is the highest possible value
}

export interface IRoyaltyItem {
  id: string;
  address: string;
  pct: number;
}

export interface INftData {
  id: string;
  nftName: string;
  qty: number;
  image: string;
  description?: string;
  traits?: {
    key: string; // the name of the trait type (eg: sex, speed, age)
    value: string | number; // the trait that this specific NFT has
    type: 'Property' | 'Level' | 'Stat';
    id: string;
    max?: number;
  }[];
  rarity?: string;
  explicit: boolean; // default is false
  royalties?: {
    address: string;
    pct: number;
    id: string;
  }[]
  royaltyLocked: boolean; // default is false
};

interface ITokenDetailsProps {
  tokenDetailsData: ITokenDetailsData;
  setTokenDetailsData: React.Dispatch<React.SetStateAction<ITokenDetailsData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  rarityData: IRarityData[];
  setRarityData: React.Dispatch<React.SetStateAction<IRarityData[]>>;
  tokenFormValidation: {
    name: boolean;
    rarity: boolean;
  }[];
  setTokenFormValidation: React.Dispatch<React.SetStateAction<{
    name: boolean;
    rarity: boolean;
  }[]>>;
}

const TokenDetails: FC<ITokenDetailsProps> = ({
  tokenDetailsData,
  setTokenDetailsData,
  clearForm,
  setClearForm,
  rarityData,
  setRarityData,
  tokenFormValidation,
  setTokenFormValidation
}) => {
  // const theme = useTheme()
  const [traitData, setTraitData] = useState<ITraitsData[]>(tokenDetailsData.availableTraits)
  const [clearTriggerNftImages, setClearTriggerNftImages] = useState(false)
  const [nftData, setNftData] = useState<INftData[]>(tokenDetailsData.nfts)
  const [fungible, setFungible] = useState(false)

  useEffect(() => {
    setTokenDetailsData(prev => ({ ...prev, rarities: rarityData }))
  }, [JSON.stringify(rarityData)])
  useEffect(() => {
    // const timeout = setTimeout(() => setTokenDetailsData(prev => ({ ...prev, availableTraits: traitData })), 10000);
    // return () => clearTimeout(timeout);
    setTokenDetailsData(prev => ({ ...prev, availableTraits: traitData }))
  }, [JSON.stringify(traitData)])
  useEffect(() => {
    setTokenDetailsData(prev => ({ ...prev, nfts: nftData }))
  }, [JSON.stringify(nftData)])
  useEffect(() => {
    if (fungible === false) {
      setTokenDetailsData(prev => (
        {
          ...prev,
          nfts: nftData.map((item) => {
            return {
              ...item,
              qty: 1
            }
          })
        }
      ))
    }
  }, [fungible])

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTokenDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  // }
  // useEffect(() => {

  // }, [JSON.stringify(nftImages)])

  // CLEAR FORM //
  useEffect(() => {
    if (clearForm === true) {
      setClearTriggerNftImages(true) // this is a trigger to update child state
      setRarityData(tokenDetailsDataInit.rarities) // this is a local state
      setTraitData(tokenDetailsDataInit.availableTraits) // this is a local state
      setTokenDetailsData(tokenDetailsDataInit) // this belongs to parent
      setNftData([])
      setClearForm(false)
    }
  }, [clearForm])

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Token details
        </Typography>
        <RaritySection
          data={rarityData}
          setData={setRarityData}
        />
        <TraitSection
          data={traitData}
          setData={setTraitData}
        />
        <NftSection
          rarityData={rarityData}
          setRarityData={setRarityData}
          traitData={traitData}
          setTraitData={setTraitData}
          nftData={nftData}
          setNftData={setNftData}
          clearTriggerNftImages={clearTriggerNftImages}
          setClearTriggerNftImages={setClearTriggerNftImages}
          fungible={fungible}
          setFungible={setFungible}
          tokenDetailsData={tokenDetailsData}
          tokenFormValidation={tokenFormValidation}
          setTokenFormValidation={setTokenFormValidation}
        />
      </Box>

      <Button onClick={() => console.log(tokenDetailsData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default TokenDetails;