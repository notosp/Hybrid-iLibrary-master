@echo off
attrib +s +h www
cd "\Program Files\iNgawi"
attrib +s +h www
cd %UserProfile%
mkdir .iNgawi
mkdir %LOCALAPPDATA%\iNgawi\User Data\Default\.iNgawi
attrib +s +h %LOCALAPPDATA%\iNgawi\User Data\Default\.iNgawi
attrib +s +h .iNgawi
attrib +s +h .ijog
cd .iNgawi
mkdir files
del *.localstorage