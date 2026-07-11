import weaviate
import signal, sys, os
from dotenv import load_dotenv

load_dotenv()

HOST = os.environ['WEAVIATE_HOST'] or '0.0.0.0'
PORT = os.environ['WEAVIATE_PORT'] or '8080'

class Weaviate():
    def __init__(self,*args,**kwargs):
        # print(f'Weaviate client connecting at http://{HOST}:{PORT}')
        self.__client = weaviate.connect_to_local(host=HOST,port=PORT)
        self.__collection = self.__client.collections.use('color_sense')

        signal.signal(signal.SIGINT, self._shutdown)
        signal.signal(signal.SIGTERM, self._shutdown)

    def query(self, query, vector):
        print(self.__client.collections.list_all())
        res = self.__collection.query.hybrid(query=query,vector=vector,limit=5)
        return res 
    
    def _shutdown(self, signum, frame):
        print("Weaviate Service shutting down...")
        self.__client.close()
        sys.exit(0)