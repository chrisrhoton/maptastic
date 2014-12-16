require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader' if development?
require_relative 'lib/entity/database.rb'

# set :bind, '0.0.0.0' # This is needed for Vagrant

get '/' do
  erb :index
end

