require 'bundler'
require 'thin'
require "sprockets"


map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path 'lib'
  run environment
end
