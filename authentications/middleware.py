import json
from authlib.jose import jwt
header = {
    'alg': 'HS256',
    'typ': 'JWT'
}
key = 'secret_code'


def AuthenticationMiddleware(request, *args, **kwargs):
    try:
        body = json.loads(request.body.decode('utf-8'))
    except:
        body = {}
    try:
        token = request.headers['Authorization']
        print(token)
        s = token.split(" ")[1]
        print(s[2:len(s)-1])
        claims = jwt.decode(s[2:len(s)-1], key)
        print(claims)
        return body, True, claims
    except Exception as e:
        print(e)
        return body, False, None
