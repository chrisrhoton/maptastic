require 'sinatra'
require 'sinatra/json'
require "sinatra/reloader" if development?

set :bind, '0.0.0.0' # This is needed for Vagrant


get '/' do
  erb :index
end

