module.exports = {
	devServer: { port: 8080 },
	reactRefresh: true,

	configureWebpack:
		process.env.NODE_ENV === "production"
			? {
					resolve: {
						alias: {
							react: require.resolve("preact/compat"),
							"react-dom": require.resolve("preact/compat"),
						},
					},
			  }
			: undefined,
}
