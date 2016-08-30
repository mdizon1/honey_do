namespace :webpack do
  desc 'compile bundles using webpack'
  task :compile do
    webpack_exec = Rails.root.join('node_modules', 'webpack', 'bin', 'webpack.js')
    cmd = "#{webpack_exec} --config config/webpack/production.config.js --json"
    output = `#{cmd}`

    stats = JSON.parse(output)

    File.open(Rails.root.join('public', 'assets', 'webpack-asset-manifest.json'), 'w') do |f|
      f.write stats['assetsByChunkName'].to_json
    end
  end

  desc 'compile for test use using webpack'
  task :compile_test do
    webpack_exec = Rails.root.join('node_modules', 'webpack', 'bin', 'webpack.js')
    cmd = "#{webpack_exec} --config config/webpack/test.config.js --json"
    output = `#{cmd}`

    stats = JSON.parse(output)

    File.open(Rails.root.join('public', 'assets', 'webpack-asset-manifest.json'), 'w') do |f|
      f.write stats['assetsByChunkName'].to_json
    end
  end


end

