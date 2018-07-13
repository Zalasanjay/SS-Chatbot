+ {^hasTag('hello')} *~2
- Hi!
- Hi, how are you?
- How are you?
- Hello
- Howdy
- Ola

+ Hi
- Hi from your bot.

+ open *1
- ^openWebbuilder(<cap1>)

+ product api
- do you have any vshop id?[yes/no]
    + yes
        - Good, then give me vshop id
    + no
        - Sorry, you will not able to use product api

+Gm
-Hello, Good Morning Vadodara

+OB
-Office Beacon Pvt Ltd

+ conversation
- What is your name?

    + [my name is] *1
       % * what is your name
       - So your first name is <cap1>?
         + ~yes
            % so your first name is *
            - Okay good.
         + *
            % so your first name is *
            - Oh, lets try this again... {@conversation}
    + what is my name
        - You just said it was <p1cap1>

+ Tt
- Hi, good to see you!\n
^ How are you today?
      + [my name is] *1
        % * How are you today
        - so nice
+ add
    -{keep} ^addMessageProp("actionDone","") Sure!
    - u already ask

+ * (Book|Save|reserve|schedule) * (appointment|meeting|event) (*)
    - ^getConversation(<cap3>)

+ * [Get|Show|List] * [Upcoming] * (appointment|meeting|event) (*)
    - ^getListAppointment(<cap2>)

+ * [Get|Show|List] * [Upcoming] * (appointment|meeting|event) *
    - ^getListAppointment("today")

+ * (Delete|Remove|Cancel) * (appointment|meeting|event) (*)
    - ^getDeleteAppointment(<cap3>)

+ * (my) * (location) *
    - ^getMapLocation()

+ (*)
   - ^getDbPediaSearch(<cap1>)