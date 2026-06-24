# import json
# import requests

# OPENSEARCH_URL = "http://opensearch-domain-endpoint:9200"
# INDEX = "colors"

# documents = [
#     {
#         "id": 1,
#         "color_name": "Deep Maroon",
#         "hex": "#D62559"
#     },
#     {
#         "id": 2,
#         "color_name": "Ocean Blue",
#         "hex": "#0077BE"
#     }
# ]

# bulk_payload = []

# for doc in documents:
#     bulk_payload.append(json.dumps({
#         "index": {
#             "_index": INDEX,
#             "_id": doc["id"]
#         }
#     }))
#     bulk_payload.append(json.dumps(doc))

# bulk_payload = "\n".join(bulk_payload) + "\n"

# response = requests.post(
#     f"{OPENSEARCH_URL}/_bulk",
#     headers={"Content-Type": "application/x-ndjson"},
#     data=bulk_payload
# )

# print(response.status_code)
# print(response.json())

def main():
    print('ok')

if __name__ == '__main__':
    main()