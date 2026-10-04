import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Kbd,
  Menu,
  NavLink,
  ScrollArea,
  SegmentedControl,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAdjustmentsHorizontal,
  IconCalendarStats,
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconPackage,
  IconRoute,
  IconSearch,
  IconSun,
  IconTicket,
  IconTrain,
  IconUsers,
  IconUserShield,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { logout } from '../../features/auth/auth-slice';
import { type ColorSchemePreference, setColorScheme, setTableDensity } from '../../features/preferences/preferences-slice';
import {
  breakpointKeys,
  componentSizeKeys,
  componentSizes,
  fontWeights,
  iconSizes,
  iconStrokeWidths,
  radiusKeys,
  textSizes,
  themeColorNames,
} from '../../shared/constants';
import { initials } from '../../shared/lib/format';
import { useAppDispatch, useAppSelector } from '../hooks';
import { queryClient } from '../query-client';

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
  const user = useAppSelector((state) => state.auth.user);
  const colorScheme = useAppSelector((state) => state.preferences.colorScheme);
  const density = useAppSelector((state) => state.preferences.tableDensity);

  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return (
    <AppShell
      className={styles.shell}
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
          <Button
            className={styles.searchButton}
            variant="default"
            leftSection={<IconSearch size={iconSizes.md} />}
            rightSection={<Kbd>/</Kbd>}
            onClick={() => navigate('/bookings')}
          >
            Search bookings, tickets, passengers
          </Button>
          <div className={styles.headerActions}>
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
            <Menu position="bottom-end" width={componentSizes.menuWidth} shadow="lg">
              <Menu.Target>
                <ActionIcon variant="default" size={componentSizeKeys.lg} radius={radiusKeys.xl} aria-label="Open user menu">
                  <Avatar size={componentSizes.avatar} radius={radiusKeys.xl} color={themeColorNames.rail}>
                    {initials(user?.fullName ?? 'Staff')}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Signed in</Menu.Label>
                <Menu.Item leftSection={<IconUserShield size={iconSizes.sm} />}>
                  <Text size={textSizes.sm} fw={fontWeights.bold}>
                    {user?.fullName ?? 'RailPass staff'}
                  </Text>
                  <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                    {user?.email}
                  </Text>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Table density</Menu.Label>
                <Menu.Item
                  leftSection={<IconAdjustmentsHorizontal size={iconSizes.sm} />}
                  onClick={() => dispatch(setTableDensity(density === 'compact' ? 'comfortable' : 'compact'))}
                >
                  {density === 'compact' ? 'Use comfortable rows' : 'Use compact rows'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color={themeColorNames.red} leftSection={<IconLogout size={iconSizes.sm} />} onClick={handleLogout}>
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar className={styles.navbar}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <IconTrain size={iconSizes.train} stroke={iconStrokeWidths.brand} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>RailPass Ops</span>
            <span className={styles.brandSub}>Ghana intercity desk</span>
          </div>
        </div>
        <ScrollArea className={styles.navScroll}>
          <nav className={styles.navList} aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActivePath(location.pathname, item.path);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  className={styles.navItem}
                  component={Link}
                  to={item.path}
                  label={item.label}
                  leftSection={<Icon size={iconSizes.xl} stroke={iconStrokeWidths.standard} />}
                  rightSection={active ? <IconChevronRight size={iconSizes.sm} /> : null}
                  active={active}
                  onClick={close}
                />
              );
            })}
          </nav>
          <Tooltip label="Revenue is simulated by the training backend">
            <div className={styles.navFooter}>
              <Text size={textSizes.sm} fw={fontWeights.bold} c="var(--rp-ink)">
                Training environment
              </Text>
              <Text size={textSizes.xs}>Operational data is seeded and safe to edit for exercises.</Text>
            </div>
          </Tooltip>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main className={styles.main} data-table-density={density}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
