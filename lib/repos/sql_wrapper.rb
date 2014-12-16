module SqlWrapper
  require 'pg'
  attr_accessor :host, :db_name
  @host = 'localhost'
  @db_name = ''

  def self.initialize(host, db_name)
    @host = host
    @db_name = db_name
  end

  def self.add_database(db_name)
    db = PG.connect(host: @host)
    db.exec("CREATE DATABASE #{db_name};")
  end

  def self.add_table(table_name)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("DROP TABLE IF EXISTS #{table_name};")
    db.exec("CREATE TABLE #{table_name} ();")
  end

  def self.drop_table(table_name)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("DROP TABLE IF EXISTS #{table_name};")
  end

  def self.add_column(table_name, column_name, column_type)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("ALTER TABLE #{table_name} ADD COLUMN #{column_name} #{column_type};")
  end

  def self.drop_column(table_name, column_name)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("ALTER TABLE #{table_name} DROP COLUMN IF EXISTS #{column_name};")
  end

  def self.import_table(table_name, columns, file_path, delimiter=',')
    db = PG.connect(host: @host, dbname: @db_name)
    columns.each do |v|
      db.exec("ALTER TABLE #{table_name} ADD COLUMN #{v.name} #{v.type};")
    end
    db.exec("COPY #{table_name} FROM '#{file_path}' DELIMITERS '#{delimiter}' CSV HEADER;")
  end

  def self.join_column(destination, columns, source1, key1, source2, key2)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("DROP TABLE IF EXISTS #{destination};")
    db.exec("CREATE TABLE #{destination} AS SELECT a.*, #{columns.join(', ').gsub(/(^|\s)/, '\1b.')} FROM #{source1} as a LEFT JOIN #{source2} as b ON a.#{key1} = b.#{key2};")
    db.exec("ALTER TABLE #{destination} ADD PRIMARY KEY (#{key1})")
  end

  def self.get_data(table_name, column_name)
    db = PG.connect(host: @host, dbname: @db_name)
    db.exec("SELECT USPS as state, INTPTLAT as lat, INTPTLONG as lon, #{column_name} as weight FROM #{table_name};")
  end
end