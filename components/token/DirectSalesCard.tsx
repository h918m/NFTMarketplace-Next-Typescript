import React, { FC, useState, useEffect, useMemo, useContext } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from '@mui/material'
import NumberIncrement from '@components/forms/NumberIncrement';
import ConfirmSale from '@components/dialogs/ConfirmPurchase';
import { ApiContext, IApiContext } from '@contexts/ApiContext';

/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

export interface IDirectSalesCardProps {
  tokenName: string;
  openNow?: boolean;
  price: number;
  currency: string;
}

const DirectSalesCard: FC<IDirectSalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [openNow, setOpenNow] = useState<boolean | undefined>(props.openNow ? false : undefined)
  const [numberSold, setNumberSold] = useState<number>(1)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [purchaseCurrency, setPurchaseCurrency] = useState('Erg')
  const [apiPriceConversion, setApiPriceConversion] = useState<{ [key: string]: number }>({
    erg: 0
  })
  const apiContext = useContext<IApiContext>(ApiContext);

  useEffect(() => {
    setNumberSold(1)
  }, [props.price])

  useEffect(() => {
    const fetchData = async () => {
      const ergPrice = await apiContext.api.get(`/asset/price/ergo`, 'https://api.ergopad.io')
      setApiPriceConversion({
        erg: ergPrice.data.price
      })
    }
    fetchData();
  }, [])

  const apiFormSubmit = (isUsd: boolean) => {
    isUsd ? (
      setTotalPrice(Number((numberSold * (apiPriceConversion[props.currency.toLowerCase()] * props.price)).toFixed(2)))
    ) : (
      setTotalPrice(numberSold * props.price)
    )
    setPurchaseCurrency(isUsd ? 'SigUSD' : props.currency)
    setConfirmationOpen(true)
  }

  return (
    <>
      <Card>
        <CardContent>
          {/* <Card sx={{ background: 'none', border: 'none', p: 0 }}>
        <CardContent sx={{ p: 0 }}> */}
          {props.price === 0 ? (
            <Typography>
              Not currently for sale
            </Typography>
          ) : (
            <>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
                sx={{
                  mb: '12px',
                  maxWidth: '100%',
                }}
              >
                <Grid item zeroMinWidth xs>
                  <Box
                    sx={{
                      // mb: '12px'
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 0,
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        lineHeight: 1.3
                      }}
                    >
                      {(props.price * numberSold).toFixed(2) + ' ' + props.currency}
                    </Typography>
                    {props.currency === 'Erg' &&
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.875rem'
                        }}
                      >
                        ${(apiPriceConversion['erg'] * props.price * numberSold).toFixed(2)} USD
                      </Typography>
                    }
                  </Box>
                </Grid>
                <Grid item xs="auto" sx={{ textAlign: 'right' }}>
                  <Box
                    sx={{
                      maxWidth: '180px'
                    }}
                  >
                    <NumberIncrement
                      value={numberSold}
                      setValue={setNumberSold}
                      label="Quantity"
                      name="Quantity"
                    />
                  </Box>
                </Grid>
              </Grid>
              {props.openNow && (
                <FormGroup sx={{ mb: '12px' }}>
                  <FormControlLabel control={
                    <Checkbox
                      checked={openNow}
                      onChange={() => setOpenNow(!openNow)}
                      inputProps={{ 'aria-label': "Open right away (I don't need the pack tokens)" }}
                    />
                  } label="Open right away (I don't need the pack tokens)" />
                </FormGroup>
              )}

              <Button
                onClick={() => apiFormSubmit(false)}
                fullWidth
                variant="contained"
              >
                Buy with {props.currency}
              </Button>

              {/* <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    onClick={() => apiFormSubmit(true)}
                    fullWidth
                    variant="outlined"
                  >
                    Buy with SigUSD
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    onClick={() => apiFormSubmit(false)}
                    fullWidth

                    variant="contained"
                  >
                    Buy with {props.currency}
                  </Button>

                </Grid>
              </Grid> */}
            </>
          )}
        </CardContent>
      </Card>
      <ConfirmSale
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        tokenName={props.tokenName}
        qty={numberSold}
        openNow={openNow}
        price={totalPrice}
        currency={purchaseCurrency}
      />
    </>
  )
}

export default DirectSalesCard