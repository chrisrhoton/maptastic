require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader' if development?
require_relative 'lib/entity/database.rb'

# set :bind, '0.0.0.0' # This is needed for Vagrant

get '/' do
  erb :index
end

get %r{/contact/?$} do

  gravatar_id = Digest::MD5::hexdigest('chris.rhoton@gmail.com')
  size = 200;
  @gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"

  erb :contact

end

