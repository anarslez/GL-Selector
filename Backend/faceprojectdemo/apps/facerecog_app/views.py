from django.shortcuts import render, HttpResponse, redirect
from django.views.generic import TemplateView
from django.http.response import JsonResponse
from django.forms.models import model_to_dict
from django.contrib import auth, messages
from django.contrib.auth.models import User, Group
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from pathlib import Path

import bcrypt, cv2, sys, imutils, math, base64, json, requests, datetime
import numpy as np

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *
from .models import *
# from .permissions import *

def test(request):
    print("IN REQUEST")
    return JsonResponse({'Success': True, 'Message': 'Talked to the API!'})

@api_view(['POST'])
def login(request):
    print(request.data)
    user = auth.authenticate(email=request.data['email'], password=request.data['password'])
    if user != None and user.is_active:
        # user.backend = 'django.contrib.auth.backends.ModelBackend'
        auth.login(request, user)
        response = Response({"success": True})
        response.set_cookie("user_id", user.id)
        return response
    return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
#        print('/////////////')
#        print(user.id)
#        print('/////////////')
       serializer.save()
       user = User.objects.get(id=serializer.data['id'])
       refresh = RefreshToken.for_user(user)
       response_context = {
           'data': serializer.data,
           'token': {
               'refresh': str(refresh),
               'access': str(refresh.access_token)
           }
       }
       # user = User.objects.get(id=serializer.data['id'])
       # if user is not None and user.is_active:
       #     auth.login(request, user)
       return Response(response_context, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def logout(request):
    auth.logout(request)
    return Response("Logged out")

def capture(request):
     # Through line 168. Analyzes pics sent to '/capture'
    body = json.loads(request.body.decode('utf-8'))
    with open("face.jpeg", "wb") as fh:
        fh.write(base64.b64decode(body['img_data']))
    image = cv2.imread("face.jpeg")
    image = imutils.resize(image, width=600)
    cv2.imwrite('face.jpeg',image)
     # Create the haar cascade
    p = Path(__file__).parents[3]/'Cascades/'
    print(str(p))
    faceCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_frontalface_alt.xml'))
    eyeCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_eye.xml'))
    smileCascade = cv2.CascadeClassifier(str(Path(p)/'haarcascade_smile.xml'))
    # Read the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.5,
        minNeighbors=5,
        minSize=(20, 20),
        maxSize = (400, 400)
    )
    errors = {}
    print("Found {0} faces!".format(len(faces)), faces)
    if (len(faces)>0):
        # Draw a rectangle around the faces
        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
            print('FACE',x, "left",y, "top",x+w, "right",y+h,"bottom",w,h)
            fwid=w
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = image[y:y+h, x:x+w]
            eyes = eyeCascade.detectMultiScale(
                roi_gray,
                scaleFactor=1.01,
                minNeighbors=5,
                minSize=(52, 52),
                maxSize=(65, 65)
            )
            hairline = 0
            ebot = 0
            eyewid = []
            temp = []
            print(eyes)
            if len(eyes)>2:
                for (ex,ey,ew,eh) in eyes:
                    temp.append(ey)
                temp = sorted(temp)
                print(temp)
                temp = temp[:len(temp)-2]
                ind = 0
                for (ex,ey,ew,eh) in eyes:
                    if ey in temp:
                        eyes = np.delete(eyes,ind,0)
                    else:
                        ind = ind+1
            print(eyes)
            for (ex,ey,ew,eh) in eyes:
                cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,0,255),2)
                print('EYE', "left", ex, "top", ey, "right", ex+ew,"bottom", ey+eh, "width", ew, "height", eh)
                hairline = hairline+ey+eh/2
                ebot = ebot + (ey+eh)/2
                eyewid = eyewid+[ex]
                eyewid = eyewid+[ex+ew]

            smiles = smileCascade.detectMultiScale(
                roi_gray,
                scaleFactor=1.2,
                minNeighbors=5,
                minSize=(50, 130),
                maxSize=(100, 200)
            )

            temp = []
            if len(smiles)>1:
                for (ex,ey,ew,eh) in smiles:
                    temp.append(ey)
                temp = sorted(temp)
                print(temp)
                temp = temp[:len(temp)-1]
                ind = 0
                for (ex,ey,ew,eh) in smiles:
                    if ey in temp:
                        smiles = np.delete(smiles,ind,0)
                    else:
                        ind = ind+1

            for (ex,ey,ew,eh) in smiles:
                cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(255,0,0),2)
                mwid=ew
                mtop=ey
                mbot=ey+eh
                mleft = ex
                mright = ex+ew
                print('MOUTH', "left", ex, "top", ey, "right", ex+ew, "bottom", ey+eh, "width", ew ,"height", eh)
                errors = {}

        if len(faces) > 1:
            errors["faces"] = "Multiple faces detected please take another picture"

        elif len(eyes) < 2:
            errors["eyes"] = "Less than 2 eyes detected please take another picture"
        elif len(smiles) < 1:
            errors["smiles"] = "No mouths detected please take another picture"
        if len(errors):
            print('these are the errors', errors)
            print(errors)
            cv2.imwrite('face.jpeg',image)
            print('wrote image')
            #context objects to kickback
            with open('face.jpeg', "rb") as image_file:
                encoded_string = str(base64.b64encode(image_file.read()))  
                encoded_string=encoded_string[2:-1]
            context_before = {
                    "error": errors,
                    "image": encoded_string
                }
            print('reached 246')
            # return requests.post('http:local:4200/', context)
            return HttpResponse(json.dumps(context_before), content_type="application/json")

        else:
            #calculations
            print('reached else')
            mofa = mwid/fwid
            chinheight = fwid-mbot
            hairline = hairline/2
            hairtomouth1 = math.atan((mleft-eyewid[0])/(mbot-hairline))*180/math.pi
            hairtomouth2 = math.atan((eyewid[3]-mright)/(mbot-hairline))*180/math.pi
            chinhypo = (chinheight**2+(mwid/2)**2)**0.5
            chinangle = 180 - 2*math.asin(chinheight/chinhypo)*180/math.pi
            hairangle = (hairtomouth1+hairtomouth2)/2
            print(mofa, chinangle, hairangle,eyewid)

            #shape classifier
            if (hairangle>16 or hairangle<-16):
                if (chinangle<110):
                    shape = "heart"
                else:
                    shape = "round"
            if (hairangle<=16 and hairangle>=-16):
                if (chinangle<110):
                    shape = "diamond"
                else:
                    if(mofa<0.4):
                        shape = "oval"
                    else:
                        shape = "square"

            cv2.imwrite('face.jpeg',image)
            print('wrote image')
            #context objects to kickback
            with open('face.jpeg', "rb") as image_file:
                encoded_string = str(base64.b64encode(image_file.read()))
                encoded_string=encoded_string[2:-1]
            if 'user_id' in request.session:
                context_before = {
                    "error": False,
                    "shape": shape,
                    "image": encoded_string,
                    "id": request.session['user_id']
                }
            else:
                context_before = {
                    "error": False,
                    "shape": shape,
                    "image": encoded_string,
                }
            print("No issues")
            return HttpResponse(json.dumps(context_before), content_type="application/json")
    else:
        errors["faces"] = "No faces detected please take another picture"
        print(errors)
        cv2.imwrite('face.jpeg',image)
        print('wrote image')
        #context objects to kickback
        with open('face.jpeg', "rb") as image_file:
            encoded_string = str(base64.b64encode(image_file.read()))
            encoded_string=encoded_string[2:-1]  
        context_before = {
                "error": errors,
                "image": encoded_string
            }
        # return requests.post('http:local:4200/', context)
        return HttpResponse(json.dumps(context_before), content_type="application/json")


def retrieve(request): # Retrieves user info after successful login
    body = json.loads(request.body.decode('utf-8'))
    user = User.objects.get(id=body)
    creation = str(user.created_at.strftime("%B")) + ' ' + str(user.created_at.year)
    facebag = []
    for mug in Face.objects.filter(user=user):
        facebag.append(Face.objects.Jsonize(mug))
    context = {
        'first_name': user.first_name,
        'last_name':  user.last_name,
        'email':  user.email,
        'created': creation,
        'faces': facebag,
    }
    return HttpResponse(json.dumps(context), content_type="application/json")
