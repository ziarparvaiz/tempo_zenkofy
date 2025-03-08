"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";

export default function PomodoroTimer() {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Pomodoro timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(pomodoroSeconds - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(pomodoroMinutes - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer completed
          setIsTimerRunning(false);
          setSessionsCompleted((prev) => prev + 1);

          // Play sound if browser supports it
          try {
            const audio = new Audio("/notification.mp3");
            audio.play();
          } catch (e) {
            console.log("Audio notification not supported");
          }

          // Show browser notification if supported
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Pomodoro Timer Completed", {
              body: "Time to take a break!",
              icon: "/favicon.ico",
            });
          }

          alert("Pomodoro timer completed! Time for a break.");
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroMinutes, pomodoroSeconds]);

  const startTimer = () => {
    // Request notification permission if not already granted
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">
          {String(pomodoroMinutes).padStart(2, "0")}:
          {String(pomodoroSeconds).padStart(2, "0")}
        </div>
        <div className="flex justify-center gap-2">
          {!isTimerRunning ? (
            <Button onClick={startTimer}>Start</Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline">
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline">
            Reset
          </Button>
        </div>

        {sessionsCompleted > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Sessions completed today: {sessionsCompleted}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Session Length</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm">5m</span>
          <Slider
            defaultValue={[25]}
            min={5}
            max={60}
            step={5}
            className="flex-1"
            onValueChange={(value) => {
              if (!isTimerRunning) {
                setPomodoroMinutes(value[0]);
                setPomodoroSeconds(0);
              }
            }}
          />
          <span className="text-sm">60m</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Clock size={16} />
          Pomodoro Technique
        </h4>
        <p>
          Work focused for 25 minutes, then take a 5-minute break. After 4
          sessions, take a longer 15-30 minute break.
        </p>
      </div>
    </div>
  );
}
