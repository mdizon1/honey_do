class DemosController < ApplicationController
  layout 'demo'
  before_action :detect_browser
  before_action :prepare_demo_config

  def index
  end

  private

  def prepare_demo_config
    @honey_do_demo_config = ReactComponents::HoneyDoDemo.new(@browser).config
  end
end
