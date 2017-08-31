require 'sinatra'
require 'square_connect'
require 'securerandom'
require 'json'

set :public_folder, Proc.new { File.join(root, "public") }
set :views, Proc.new { File.join(root, "views") }

access_token = 'REPLACE_WITH_YOUR_ACCESS_TOKEN'

SquareConnect.configure do |config|
  config.access_token = access_token
end

get '/' do
  erb :index, layout: :layout
end

post '/' do
  
  # 決済に使う店舗の情報を取得します
  locations_api = SquareConnect::LocationsApi.new
  begin
    locations_response = locations_api.list_locations
    puts locations_response
  rescue SquareConnect::ApiError => e
    raise "Error encountered while listing locations: #{e.message}"
  end

  # Get a location able to process transaction
  location = locations_response.locations.detect do |l|
    l.capabilities.include?("CREDIT_CARD_PROCESSING")
  end

  if location.nil?
    raise "Activation required.
    Visit https://squareup.com/activate to activate and begin taking payments."
  end
  
  transactions_api = SquareConnect::TransactionsApi.new
  request_body = {
    :card_nonce => params[:nonce],
    :amount_money => {
      :amount => 5000,
      :currency => 'JPY'
    },
    :idempotency_key => SecureRandom.uuid
  }
  
  begin
    resp = transactions_api.charge(location.id, request_body)
  rescue SquareConnect::ApiError => e
    raise "Error encountered while charging card: #{e.message}"
  end
  redirect "/result?data=#{resp.to_hash.to_json}"
end

get '/result' do
  json = JSON.parse(params[:data])
  erb :result, locals: {result: json}
end
