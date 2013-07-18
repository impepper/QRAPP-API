#!/usr/bin/env python

# Import MySQl support Library
import pymysql,errno

# Import Threading Library
import subprocess,threading

# Import File/directory related function
import os.path

# Import smtplib for the actual sending function
import smtplib

# For guessing MIME type
import mimetypes

# Import the email modules we'll need
import email
import email.mime.application

import time

# Call Commands in Treads
def popenAndCall(apkDirectory,popenArgs):
    """
    Runs the given args in a subprocess.Popen, and then calls the function
    onExit when the subprocess completes.
    onExit is a callable object, and popenArgs is a list/tuple of args that 
    would give to subprocess.Popen.
    """
    def runInThread(apkDirectory,popenArgs):
        # apkDirectory = '/home/pepper/buildAPK/APK_'+str(r[0])
        # Processing Build Script in threads
        proc = subprocess.Popen(['bash','tibuild.sh',apkDirectory],bufsize=8192)
        proc.wait()

        # Start to Mail APK File
        
        # Send APK file when it was successfully built

        # filename=apkDirectory+'/mCMS QR Reader.apk'
        # filename=apkDirectory+'/tibuild.sh'
        filename=apkDirectory+'/mCMS QR Reader.apk'
        if os.path.isfile(filename):

            # Send file to Server
            randfilename = 'AppGen'+apkDirectory[25:]+'.apk'
            proc = subprocess.Popen(['wput','-nc','-u',filename,'ftp://root:impepper0204@tonido.fuihan.com/../media/disk1part1/AppData/'+randfilename],bufsize=8192)

            # Create a text/plain message
            msg = email.mime.Multipart.MIMEMultipart()
            msg['Subject'] = 'Greetings'
            msg['From'] = 'chihong.lin@gmail.com'
            msg['To'] = 'impepper@gmail.com'

            # The main body is just another attachment
            # Send As Text Format
            # bodyText = email.mime.Text.MIMEText("""Hello, how are you? I am fine.
# This is a rather nice letter, don't you think?
# Download Link: http://tonido.fuihan.com/"""+randfilename, 'plain')
            # msg.attach(bodyText)

            # Send As HTML Format
            bodyHTML = email.mime.Text.MIMEText("""Hello, how are you HTML? I am fine.<br />
<a href='http://tonido.fuihan.com/"""+randfilename+"""'This</a> is a rather nice letter, don't you think?""", 'html')
            msg.attach(bodyHTML)

            # File attachment
            # fp=open(filename,'rb')
            # att = email.mime.application.MIMEApplication(fp.read(),_subtype="binary")
            # fp.close()
            # att.add_header('Content-Disposition','attachment',filename=filename)
            # msg.attach(att)

            # Send via Gmail server
            # s = smtplib.SMTP('smtp.gmail.com',587)
            # s.starttls()
            # s.login('chihong.lin@gmail.com','impepper0204')

            # Send via Hinet Xuite Mail server
            # s = smtplib.SMTP('smtp.mail.xuite.net')
            # s.login('impepper','hala0204')

            # Send via Hinet MSA Mail server
            s = smtplib.SMTP('msr.hinet.net',25)

            s.sendmail('chihong.lin@gmail.com',['impepper@gmail.com'], msg.as_string())
            s.quit()        
        return

    thread = threading.Thread(target=runInThread, args =(apkDirectory,popenArgs))
    thread.start()
    # returns immediately after the thread starts
    return thread

# Define mysql connection
# conn = pymysql.connect(host='127.0.0.1', port=3306, user='hungsing_mcms', passwd='hala0204', db='hungsing_mcms')
conn = pymysql.connect(host='qr-apps.com', port=3306, user='hungsing_mcms', passwd='hala0204', db='hungsing_mcms')

# Define query cursor
cur = conn.cursor()

cur.execute("SELECT uc_user_apps.app_id as id, uc_users.email as email FROM uc_user_apps,uc_users where uc_user_apps.user_id=uc_users.id limit 1")

for r in cur.fetchall():

    # Prepare Output Directory
    directory = '/home/pepper/buildAPK/APK_'+str(r[0])
    # directory = '/home/pepper'
    if not os.path.exists(directory):
       os.makedirs(directory)

    # Apapend files with text
    with open("/home/pepper/mcms-qr-reader/Resources/conf/defaultaccount.js", "w") as myJSfile:
        accountString="""Ti.App.Properties.setBool('auto_login',true);
Ti.App.Properties.setBool('local_user',true);
Ti.App.Properties.setString('cloud_useremail','viewer."""+str(r[0])+"."+r[1]+"');"
        myJSfile.write(accountString)
        file(directory+'/defaultaccount.js','w').write(accountString)

    # Rewrite manifest file
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
        file(directory+'/manifest','w').write(accountString)

    # Change XML Value
    from xml.etree import ElementTree as et
    tree_appid = et.parse('/home/pepper/mcms-qr-reader/tiapp.xml')
    tree_appid.find('.//id').text = 'com.fuihan.qrapp'+str(r[0])
    tree_appid.find('.//description').text = 'This is the Official Deployment for QR Apps Tranformation.'
    tree_appid.write('/home/pepper/mcms-qr-reader/tiapp.xml',encoding='UTF-8')

    # Correct XML namespaces
    txt = file('/home/pepper/mcms-qr-reader/tiapp.xml').read()
    txt = txt.replace('ns0:','ti:')
    txt = txt.replace(':ns0',':ti')
    txt = txt.replace('ns1:','android:')
    txt = txt.replace(':ns1',':android')
    file('/home/pepper/mcms-qr-reader/tiapp.xml','w').write(txt)
    file(directory+'/tiapp.xml','w').write(txt)

    # Excute build commands    
    cmdLine = ['bash','tibuild.sh',directory]
    popenAndCall(directory,cmdLine)

    time.sleep(250)

cur.close()
conn.close()
