import {
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography
} from '@mui/material'
import { ComponentProps, useState } from 'react'
import { Logo } from '@/components/Icon'
import { Icon } from '@/components/Icon/types'
import * as Icons from '@/components/Icon'
import { useRouter } from 'next/router'
import Link from 'next/link'

type List = {
  text: string
  href?: string
  divider?: boolean
  icon?: Icon
}

type Props = {
  list: List[]
} & ComponentProps<typeof MuiDrawer>

const MenuBar = styled(MuiDrawer)`
  .logo {
    font-size: 105px;
    position: absolute;
  }

  a {
    color: inherit;
  }
`

export default function Drawer({ list, ...props }: Props) {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(-1)

  return (
    <MenuBar
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box' }
      }}
      {...props}
    >
      <Link href="/account/">
        <Toolbar variant="dense">
          <Logo className="logo" />
        </Toolbar>
      </Link>
      <Divider />
      {list.map(({ text, divider, icon, href }, index) => {
        const Icon = Icons[icon]
        return (
          <List key={text}>
            <ListItem
              dense
              component={!!href ? 'a' : 'div'}
              href={href || undefined}
              onClick={(e) => {
                e.preventDefault()
                href && setSelectedIndex(index)
                href && router.push(href)
              }}
              sx={{ paddingTop: '1px', paddingBottom: '1px' }}
            >
              <ListItemButton selected={selectedIndex === index ? true : false}>
                {icon && (
                  <ListItemIcon sx={{ fontSize: 14, minWidth: 30 }}>
                    {<Icon />}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={
                        icon
                          ? { color: '#000', fontSize: 14, fontWeight: 500 }
                          : { fontSize: 14 }
                      }
                    >
                      {text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {divider && <Divider />}
          </List>
        )
      })}
    </MenuBar>
  )
}
