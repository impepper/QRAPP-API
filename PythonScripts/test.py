#!/usr/bin/env python

# Import MySQl support Library
import os.path
import pymysql
import subprocess
# Import smtplib for the actual sending function
import smtplib

# For guessing MIME type
import mimetypes

# Import the email modules we'll need
import email
import email.mime.application

#define mysql connection
#conn = pymysql.connect(host='127.0.0.1', port=3306, user='hungsing_mcms', passwd='hala0204', db='hungsing_mcms')
conn = pymysql.connect(host='qr-apps.com', port=3306, user='hungsing_mcms', passwd='hala0204', db='hungsing_mcms')

#define query cursor
cur = conn.cursor()

cur.execute("SELECT uc_user_apps.app_id as id, uc_users.email as email FROM uc_user_apps,uc_users where uc_user_apps.user_id=uc_users.id and uc_users.id=6")

# print cur.description

# r = cur.fetchall()
# print r
# ...or...
# for r in cur.fetchall():
for r in cur.fetchall():

    #apapend files with text
    with open("/home/pepper/mcms-qr-reader/Resources/conf/defaultaccount.js", "w") as myJSfile:
        accountString="""Ti.App.Properties.setBool('auto_login',true);
Ti.App.Properties.setBool('local_user',true);
Ti.App.Properties.setString('cloud_useremail','viewer."""+str(r[0])+"."+r[1]+"');"
        myJSfile.write(accountString)

    with open("/home/pepper/mcms-qr-reader/manifest", "w") as myManifestfile:
        accountString="""#appname:App_LE
#publisher:ChiHong Lin
#url:http://
#image:appicon.png
#appid:com.fuihan.qrapp"""+str(r[0])+"""
#desc:This is the Official Deployment for QR Apps Tranformation.
#type:ipad
#guid:342e1d1a-cedc-4917-beaf-2ae0c0c2bd92
"""
        myManifestfile.write(accountString)

    #change XML Value
    from xml.etree import ElementTree as et
    # et.register_namespace({"http://ti.appcelerator.org":'ti'})
    # et.ElementTree._namespace_map.update( {"http://ti.appcelerator.org":'ti'} )
    tree_appid = et.parse('/home/pepper/mcms-qr-reader/tiapp.xml')
    tree_appid.find('.//id').text = 'com.fuihan.qrapp'+str(r[0])
    # tree_appid.find('.//description').text = 'This is the Official Deployment for QR Apps Tranformation.'
    tree_appid.write('/home/pepper/mcms-qr-reader/tiapp.xml',encoding='UTF-8')

    # data.write('/home/pepper/mcms-qr-reader/tiapp.xml')
    txt = file('/home/pepper/mcms-qr-reader/tiapp.xml').read()
    txt = txt.replace('ns0:','ti:')
    txt = txt.replace(':ns0',':ti')
    txt = txt.replace('ns1:','android:')
    txt = txt.replace(':ns1',':android')
    file('/home/pepper/mcms-qr-reader/tiapp.xml','w').write(txt)

    proc = subprocess.Popen(['bash','tibuild.sh','~/'],bufsize=8192)
    proc.wait()

    #Start to Mail APK File
    #if os.path.isfile(apkDirectory+"/mCMS QR Reader.apk"):
    # Create a text/plain message
    msg = email.mime.Multipart.MIMEMultipart()
    msg['Subject'] = 'Greetings'
    msg['From'] = 'chihong.lin@gmail.com'
    msg['To'] = 'impepper@gmail.com'

    # The main body is just another attachment
    body = email.mime.Text.MIMEText("""Hello, how are you? I am fine.
    This is a rather nice letter, don't you think?""")
    msg.attach(body)

    # PDF attachment
    # filename='/home/pepper/mCMS QR Reader.apk'
    filename='/home/pepper/tibuild.sh'
    fp=open(filename,'rb')
    att = email.mime.application.MIMEApplication(fp.read(),_subtype="pdf")
    fp.close()
    att.add_header('Content-Disposition','attachment',filename=filename)
    msg.attach(att)

    # send via Gmail server
    # NOTE: my ISP, Centurylink, seems to be automatically rewriting
    # port 25 packets to be port 587 and it is trashing port 587 packets.
    # So, I use the default port 25, but I authenticate. 
    s = smtplib.SMTP('smtp.gmail.com',587)
    s.starttls()
    s.login('chihong.lin@gmail.com','impepper0204')
    s.sendmail('chihong.lin@gmail.com',['impepper@gmail.com'], msg.as_string())
    s.quit()

cur.close()
conn.close()
