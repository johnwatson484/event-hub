const route = {
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'src/assets/css',
        'src/assets/js',
      ],
    },
  },
}

export default route
