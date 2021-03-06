module ApplicationHelper
  def webpack_bundle_tag(bundle)
    src =
      if Rails.configuration.webpack[:use_manifest]
        manifest = Rails.configuration.webpack[:asset_manifest]
        filename = manifest[bundle]
        "#{compute_asset_host}/assets/#{filename}"
      else
        "#{compute_asset_host}/assets/#{bundle}-bundle"
      end

    javascript_include_tag(src)
  end

  def webpack_manifest_script
    return '' unless Rails.configuration.webpack[:use_manifest]
    javascript_tag "window.webpackManifest = #{Rails.configuration.webpack[:common_manifest]}"
  end

  def webpack_javascript_include_helper
    unless Rails.env.development? || Rails.env.test?
      return [
        webpack_manifest_script,
        webpack_bundle_tag( 'public')
      ].join.html_safe
    end
    host = (Rails.configuration.development[:remote].present? ? Rails.configuration.development[:remote] : 'localhost')
    [
      content_tag(:script, '', :src => "http://#{host}:8080/webpack-dev-server.js"),
      content_tag(:script, '', :src => "http://#{host}:8080/webpack/bundle.js")
    ].join.html_safe
  end
end
