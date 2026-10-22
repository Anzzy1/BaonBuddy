Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = "C:\Personal Projects\first claude pro project"
Do
  sh.Run "cmd /c npm run dev", 0, True
  WScript.Sleep 3000
Loop
