module.exports = {
	devServer: { port: 8080 },
	reactRefresh: true,

	configureWebpack:
		process.env.NODE_ENV === "production"
			? {
					resolve: {
						alias: {
							react: "preact/compat",
							"react-dom": "preact/compat",
						},
					},
			  }
			: undefined,
}
