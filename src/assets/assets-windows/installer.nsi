; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "iNgawi"
!define APPNAMEANDVERSION "iNgawi"

; Use compression
SetCompressor LZMA

ShowInstDetails nevershow
ShowUninstDetails nevershow

!include "MUI2.nsh"
!include LogicLib.nsh
!include x64.nsh

Name "iNgawi"
BrandingText "iNgawi Installer"

# set the icon
!define MUI_ICON "icon.ico"
!define MUI_ABORTWARNING

# define the resulting installer's name:
OutFile "..\..\..\dist\iNgawiSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\iNgawi\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "License.txt"
!define MUI_PAGE_CUSTOMFUNCTION_SHOW DirectoryShow
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!define MUI_FINISHPAGE_RUN_TEXT "Start iNgawi"
!define MUI_FINISHPAGE_RUN "$INSTDIR\iNgawi.exe"

#!insertmacro MUI_UNPAGE_CONFIRM
#!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

Function DirectoryShow
  FindWindow $R0 "#32770" "" $HWNDPARENT
  GetDlgItem $R1 $R0 1019
  EnableWindow $R1 0
  FindWindow $R0 "#32770" "" $HWNDPARENT
  GetDlgItem $R1 $R0 1001
  EnableWindow $R1 0
FunctionEnd

#!insertmacro MUI_RESERVEFILE_LANGDLL

# default section start
Section
  ExecWait 'taskkill /F /IM iNgawi.exe'

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  #File "iNgawi.chm"
  File "ignsdk.bat"

  # specify the files to go in the output path
  File /r ..\..\..\build\iNgawi\win32\*

  SetOutPath $WINDIR
  File "unzip.exe"

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  SetOutPath $PROFILE
  File "unzip.exe"


  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\iNgawi.lnk" "$INSTDIR\iNgawi.exe"
  CreateShortCut "$SMPROGRAMS\iNgawi\iNgawi.lnk" "$INSTDIR\iNgawi.exe"
  CreateShortCut "$SMPROGRAMS\iNgawi\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  #CreateShortCut "$SMPROGRAMS\iNgawi\Manual.lnk" "$INSTDIR\iNgawi.chm"
  CreateShortCut "$DESKTOP\iNgawi.lnk" "$INSTDIR\iNgawi.exe"

  ExecWait '"$INSTDIR\ignsdk.bat"'
  Delete "$INSTDIR\ignsdk.bat"

  WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\Uninstall.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  ;Remove from registry...
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
  DeleteRegKey HKLM "SOFTWARE\${APPNAME}"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\iNgawi.lnk"
  Delete "$SMPROGRAMS\Uninstall.lnk"
  Delete "$DESKTOP\iNgawi.lnk"

SectionEnd

; On initialization
Function .onInit

  !insertmacro MUI_LANGDLL_DISPLAY
  
  ReadRegStr $R0 HKLM \
  "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" \
  "UninstallString"
  StrCmp $R0 "" done
 
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "${APPNAME} is already installed. $\n$\nClick `OK` to remove the \
  previous version or `Cancel` to cancel this upgrade." \
  IDOK uninst
  Abort
 
;Run the uninstaller
uninst:
  ClearErrors
  ExecWait '$R0 _?=$INSTDIR' ;Do not copy the uninstaller to a temp file
 
  IfErrors no_remove_uninstaller done
    ;You can either use Delete /REBOOTOK in the uninstaller or add some code
    ;here to remove the uninstaller. Use a registry key to check
    ;whether the user has chosen to uninstall. If you are using an uninstaller
    ;components page, make sure all sections are uninstalled.
  no_remove_uninstaller:
 
done:

FunctionEnd
