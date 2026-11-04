export type NavLink = {
  label: string
  path: string
  children?: NavLink[]
  column?: string
}

export const navLinks: NavLink[] = [
  {
    label: 'Projects',
    path: '/projects',
    children: [
      {
        label: '3D Projects',
        path: '/projects/3d',
        children: [

          { label: 'Jensen Interceptor', path: '/projects/3d/jensen', column: 'Artwork' },
          { label: 'LEGO Imperial Cruiser', path: '/projects/3d/legoimpcr', column: 'Artwork' },
          { label: 'Wanderlust', path: '/projects/3d/wanderlust', column: 'Artwork' },
          { label: 'Warmth of Light', path: '/projects/3d/wol', column: 'Artwork' },
          { label: 'Dude', path: '/projects/3d/dude', column: 'Artwork' },
          { label: 'Ice Cream Ad', path: '/projects/3d/icecream', column: 'Artwork' },
          { label: 'Lonely Island', path: '/projects/3d/lonelyisland', column: 'Artwork' },

          { label: 'NatureShots', path: '/projects/3d/nature2026', column: 'Series' },
          { label: 'Isometric Rooms', path: '/projects/3d/isometric', column: 'Series' },

          { label: 'Diorama A', path: '/projects/3d/diorama-a', column: 'Group' },
          { label: 'Diorama B', path: '/projects/3d/diorama-b', column: 'Group' },
        ],
      },
      {
        label: 'Technical Art',
        path: '/projects/techart',
        children: [

          { label: 'MatBalls', path: '/projects/techart/matballs', column: 'Textures' },

          { label: 'Medieval House', path: '/projects/3d/medhouse', column: 'Procedural' },

          { label: 'Abstract Sculpture', path: '/projects/3d/sculpture', column: 'DevLog' },
          { label: 'Mechanical Part', path: '/projects/3d/part', column: 'DevLog' }
        ],
      },
      {
        label: 'Webdev',
        path: '/projects/webdev',
      },
      {
        label: 'Games',
        path: '/projects/games',
        children: [

          { label: 'Gleam', path: '/projects/games/gleam', column: 'Group Project' },
          { label: 'Inkheist', path: '/projects/games/inkheist', column: 'Group Project' },
          { label: 'Clawsembly Line', path: '/projects/games/clawsembly', column: 'Group Project' },

          { label: 'Bunny Loot', path: '/projects/games/bunnyloot', column: 'Game Jam' },
          { label: 'Wizarchitect', path: '/projects/games/wizarchitect', column: 'Game Jam' },
          { label: 'Let It Cook', path: '/projects/games/letitcook', column: 'Game Jam' },

          { label: 'Abstract Sculpture', path: '/projects/games/sculpture', column: 'Solo Project' }
        ],
      },
      {
        label: 'Webviewer',
        path: '/projects/3d_webviewer',
      },
    ],
  },
  {
    label: 'Résumé',
    path: '/resume',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
]
