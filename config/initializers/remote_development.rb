if Rails.env == 'development' && ENV['REMOTE_DEVELOPMENT']
  Rails.configuration.development[:remote] = ENV['REMOTE_DEVELOPMENT']
end
