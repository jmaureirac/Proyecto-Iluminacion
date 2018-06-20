module.exports.USER_MENU = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: 'dashboard' },
        { titulo: 'Mi perfil', url: 'perfil' }
      ]
    },
    {
      titulo: 'Productos',
      icono: 'mdi mdi-lightbulb-on-outline',
      submenu: [
        { titulo: 'Productos', url: 'productos' }
      ]
    },
    {
      titulo: 'Cotizaciones',
      icono: 'mdi mdi-content-paste',
      submenu: [
        { titulo: 'Cotizar', url: 'cotizar' },
        { titulo: 'Mis cotizaciones', url: 'mis-cotizaciones' }
      ]
    }
  ];

module.exports.ADMIN_MENU = [
    {
        titulo: 'Principal',
        icono: 'mdi mdi-gauge',
        submenu: [
        { titulo: 'Dashboard', url: 'dashboard' },
        { titulo: 'Mi perfil', url: 'perfil' }
        ]
    },
    {
        titulo: 'Usuarios',
        icono: 'mdi mdi-account-multiple',
        submenu: [
        { titulo: 'Usuarios', url: 'usuarios' }
        ]
    },
    {
        titulo: 'Productos',
        icono: 'mdi mdi-lightbulb-on-outline',
        submenu: [
        { titulo: 'Productos', url: 'productos' },
        { titulo: 'Inventario', url: 'inventario' }
        ]
    },
    {
        titulo: 'Cotizaciones',
        icono: 'mdi mdi-content-paste',
        submenu: [
        { titulo: 'Cotizar', url: 'cotizar' },
        { titulo: 'Cotizaciones', url: 'cotizaciones' },
        { titulo: 'Mis cotizaciones', url: 'mis-cotizaciones' }
        ]
    },
    {
        titulo: 'Clasificación',
        icono: 'mdi mdi-information-outline',
        submenu: [
        { titulo: 'Categorias', url: 'clasificacion/categorias' },
        { titulo: 'Subcategorias', url: 'clasificacion/subcategorias' },
        { titulo: 'Marcas', url: 'clasificacion/marcas' },
        ]
    }
      
];
