module Database
  require_relative '../repos/sql_wrapper'
  require 'ostruct'
  @host = ENV['MAPTASTIC_HOST']
  @port = 5432
  @dbname = 'maptastic'
  @user = ENV['MAPTASTIC_USER']
  @password = ENV['MAPTASTIC_PASSWORD']

  def self.import_crosswalk(path)
    SqlWrapper.initialize(host: @host, port: @port, dbname: @dbname, user: @user, password: @password)
    SqlWrapper.add_table('crosswalk_census_tract')
    columns = []
    columns.push(OpenStruct.new(:name => 'USPS', :type => 'char(2)'))
    columns.push(OpenStruct.new(:name => 'GEOID', :type => 'char(11) primary key'))
    columns.push(OpenStruct.new(:name => 'ALAND', :type => 'bigint'))
    columns.push(OpenStruct.new(:name => 'AWATER', :type => 'bigint'))
    columns.push(OpenStruct.new(:name => 'ALAND_SQMI', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'AWATER_SQMI', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'INTPTLAT', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'INTPTLONG', :type => 'double precision'))
    SqlWrapper.import_table('crosswalk_census_tract', columns, path, "\t")
    SqlWrapper.drop_column('crosswalk_census_tract', 'ALAND')
    SqlWrapper.drop_column('crosswalk_census_tract', 'AWATER')
    SqlWrapper.drop_column('crosswalk_census_tract', 'ALAND_SQMI')
    SqlWrapper.drop_column('crosswalk_census_tract', 'AWATER_SQMI')
  end

  def self.import_data(path)
    SqlWrapper.initialize(host: @host, port: @port, dbname: @dbname, user: @user, password: @password)
    SqlWrapper.add_table('data_census_tract')
    columns = []
    columns.push(OpenStruct.new(:name => 'GEOID', :type => 'char(11) primary key'))
    columns.push(OpenStruct.new(:name => 'GEOID_LABEL', :type => 'text'))
    columns.push(OpenStruct.new(:name => 'HC01_VC03', :type => 'integer'))
    columns.push(OpenStruct.new(:name => 'HC01_VC04', :type => 'integer'))
    columns.push(OpenStruct.new(:name => 'HC03_VC04', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC20', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC23', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC28', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC29', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC30', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC31', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC33', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC01_VC36', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC75', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC76', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC77', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC78', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC79', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC80', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC81', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC82', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC83', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC03_VC84', :type => 'double precision'))
    columns.push(OpenStruct.new(:name => 'HC01_VC90', :type => 'integer'))
    SqlWrapper.import_table('data_census_tract', columns, path, ',')
  end

  def self.join_geography
    SqlWrapper.initialize(host: @host, port: @port, dbname: @dbname, user: @user, password: @password)
    columns = ['USPS', 'INTPTLAT', 'INTPTLONG']
    SqlWrapper.join_column('data_census_points', columns, 'data_census_tract', 'GEOID', 'crosswalk_census_tract', 'GEOID')
  end

  def self.get_data(column_name)
    SqlWrapper.initialize(host: @host, port: @port, dbname: @dbname, user: @user, password: @password)
    response = SqlWrapper.get_data('data_census_points', column_name)
    arr = []
    response.each do |v|
      if (v['weight'] != nil)
        arr.push(v)
      end
    end
    return arr
  end
end

# Database.import_crosswalk('/Users/chris/code/mks/experiments/map-it/public/assets/data/2013_Gaz_tracts_national.txt')
# Database.import_data('/Users/chris/code/mks/experiments/map-it/public/assets/data/ACS_13_5YR_DP03_with_ann.csv')
# Database.join_geography
#Database.get_data('HC03_VC04').each_with_index do |v, i|
#  puts test
#end