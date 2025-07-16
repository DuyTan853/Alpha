import psycopg2 
def connect_to_db():
    """
    Connect to the PostgreSQL database and return the connection object.
    """
    try:
        # Replace with your actual database connection details      
        
        conn = psycopg2.connect(
            host="localhost",
            database="GNAR",
            user="postgres",
            password="12345678",
            port="5432"  # Default PostgreSQL port
        )
        print("Connection successful !")
    except Exception as e:
        print("Error connecting to the database:", e)
        return None
    return conn
connect_to_db()

