#Rails.application.config.assets.configure do |env|
#  env.unregister_postprocessor 'application/javascript', Sprockets::SafetyColons
#end
Rails.application.config.assets.paths << Rails.root.join('app', 'assets', 'videos')
