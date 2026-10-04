// Course version (lesson 09) — becomes the full RailPass version in lesson 12.

import { AppShell, Burger, Button, NavLink, ScrollArea, SegmentedControl, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendarStats,
  IconMoon,
  IconPackage,
  IconRoute,
  IconSearch,
  IconSun,
  IconTicket,
  IconTrain,
  IconUsers,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { type ColorSchemePreference, setColorScheme } from '../../features/preferences/preferences-slice';
import { breakpointKeys, componentSizeKeys, componentSizes, iconSizes, spacingKeys } from '../../shared/constants';
import { useAppDispatch, useAppSelector } from '../hooks';

import styles from './dashboard-layout.module.css';

const navItems = [
  { label: 'Overview', path: '/', icon: IconCalendarStats },
  { label: 'Journeys', path: '/journeys', icon: IconTrain },
  { label: 'Stations & Routes', path: '/network', icon: IconRoute },
  { label: 'Bookings', path: '/bookings', icon: IconTicket },
  { label: 'Passengers', path: '/passengers', icon: IconUsers },
  { label: 'Extras & Fares', path: '/extras', icon: IconPackage },
];

function isActivePath(current: string, path: string) {
  return path === '/' ? current === '/' : current.startsWith(path);
}

export function DashboardLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const colorScheme = useAppSelector((state) => state.preferences.colorScheme);

  return (
    <AppShell
      header={{ height: componentSizes.headerHeight }}
      navbar={{ width: componentSizes.navbarWidth, breakpoint: breakpointKeys.md, collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header className={styles.header}>
        <div className={styles.headerInner}>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom={breakpointKeys.md}
            size={componentSizeKeys.sm}
            aria-label="Toggle navigation"
          />
          <Button variant="default" leftSection={<IconSearch size={iconSizes.md} />} onClick={() => navigate('/bookings')}>
            Search bookings, tickets, passengers
          </Button>

          <SegmentedControl
            aria-label="Colour scheme"
            value={colorScheme}
            onChange={(value) => dispatch(setColorScheme(value as ColorSchemePreference))}
            data={[
              { value: 'light', label: <IconSun size={iconSizes.sm} aria-label="Light" /> },
              { value: 'dark', label: <IconMoon size={iconSizes.sm} aria-label="Dark" /> },
              { value: 'auto', label: 'Auto' },
            ]}
          />
        </div>
      </AppShell.Header>
      <AppShell.Navbar className={styles.navbar}>
        <div className={styles.brand}>
          <IconTrain size={iconSizes.train} />
          <Text fw={800}>RailPass Ops</Text>
        </div>
        <ScrollArea className={styles.navScroll}>
          <nav className={styles.navList} aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(location.pathname, item.path);
              return (
                <NavLink
                  key={item.path}
                  component={Link}
                  to={item.path}
                  label={item.label}
                  leftSection={<Icon size={iconSizes.xl} />}
                  active={active}
                  onClick={close}
                />
              );
            })}
          </nav>
          <div className={styles.navFooter}>
            <Text size="sm">Training data is seeded and safe to edit.</Text>
          </div>
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main className={styles.main} p={spacingKeys.lg}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
