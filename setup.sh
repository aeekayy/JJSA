sudo su - postgres
createuser --createdb --createrole --superuser aeekayy
createdb --owner aeekayy jjsa
exit
sudo apt-get install python-psycopg2
sudo apt-get install libpq-dev
