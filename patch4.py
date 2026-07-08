import os

target_path = os.path.join("src", "App.tsx")
with open(target_path, "r", encoding="utf-8") as f:
    content = f.read()

promotion_logic = """    // 1. Natural stat fluctuations & career progression
    if (nextCareer.type === 'job' && nextCareer.performance !== undefined) {
      if (nextCareer.performance < 20 && nextCareer.yearsInRole > 0) {
        if (nextCareer.title.includes('Senior ')) {
          nextCareer.title = nextCareer.title.replace('Senior ', '');
          nextCareer.salary = Math.floor(nextCareer.salary * 0.7);
          nextCareer.performance = 50;
          newLogs.push(`📉 Demotion! Due to poor performance, you were demoted to ${nextCareer.title}. Salary decreased to $${nextCareer.salary.toLocaleString()}/yr.`);
        } else {
          nextCareer = { title: 'Unemployed', salary: 0, type: 'unemployed', yearsInRole: 0 };
          newLogs.push(`❌ Fired! You were fired from your job due to extremely poor performance.`);
        }
      } else if (nextCareer.performance > 90 && nextCareer.yearsInRole > 2) {
        if (!nextCareer.title.includes('Senior ') && !nextCareer.title.includes('President') && !nextCareer.title.includes('Manager')) {
          nextCareer.title = 'Senior ' + nextCareer.title.replace('Junior ', '');
          nextCareer.salary = Math.floor(nextCareer.salary * 1.3);
          nextCareer.performance = 50;
          nextCareer.yearsInRole = 0;
          newLogs.push(`📈 Promotion! Your exceptional hard work paid off! You were promoted to ${nextCareer.title} earning $${nextCareer.salary.toLocaleString()}/yr.`);
        } else {
          const raise = Math.floor(nextCareer.salary * 1.15);
          nextCareer.salary = raise;
          nextCareer.performance = 50;
          newLogs.push(`💰 Raise! For your outstanding performance, your boss gave you a huge raise to $${raise.toLocaleString()}/yr!`);
        }
      } else if (nextCareer.performance >= 50) {
        // Natural performance decay over a year
        nextCareer.performance = Math.max(0, nextCareer.performance - (Math.floor(Math.random() * 15) + 5));
      }
    }
"""

content = content.replace("    // 1. Natural stat fluctuations & career progression", promotion_logic)

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patch 4 Success")
