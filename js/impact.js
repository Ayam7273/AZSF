document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
        const dataId = card.dataset.id;
  
        // Content for each card (can be fetched dynamically if needed)
        const cardContent = {
            nazanin: {
                image: "assets/stories1.png",
                title: "How Your Zakat Helped Nazanin Overcome Financial Hardship and Support Her Daughter",
                description:
                "Nazanin, a mother of three, never imagined she would face the overwhelming challenges that came her way. Her eldest daughter, a bright university student, began experiencing severe mental health struggles. The emotional and mental toll on the family was immense, and Nazanin made the difficult decision to leave her job as a trainee counsellor in order to care for her daughter full-time. The financial pressure quickly mounted, and with no income, she struggled to keep up with essential household expenses, leaving her scared and overwhelmed. Nazanin could also no longer afford to pay for her counsellor training, leaving her uncertain about her future work prospects. Nazanin didn’t know where to turn for help, but eventually discovered NZF through her local mosque. It was the lifeline she needed in the darkest of times. When Nazanin reached out to NZF, she found the support she desperately needed. Your Zakat helped her cover her expenses so that she could focus on her daughter’s recovery.",
            },

            bilal: {
                image: "assets/stories2.png",
                title: "How Zakat Helped Bilal Provide for His Family Again.",
                description:
                "When Bilal lost his job, his family’s life drastically changed. Struggling to keep up with household bills and provide for his wife and three children, Bilal’s situation became increasingly dire. Despite his best efforts to find new employment, he couldn’t secure anything that allowed him to meet their basic needs. Overwhelmed with debt, Bilal was at risk of losing his home, leaving him stressed and uncertain about his family’s future. But then Bilal came across NZF and found the support he desperately needed. Thanks to your Zakat, Bilal received funding to attend a job training course and gain the skills necessary to get back on his feet. Today, Bilal is employed in a stable job that allows him to support his family and clear his debts. He’s proud to be able to provide for his loved ones once again. Bilal expressed his gratitude for the lifeline NZF provided, saying that without your Zakat, he wouldn’t have been able to rebuild his life and secure a better future for his children. Your Zakat has helped Bilal regain his confidence and independence, and enabled him to focus on giving his family a brighter future.",
            },

            mariam: {
                image: "assets/stories3.png",
                title: "The Transformative Power of Local Zakat",
                description:
                "When other children were bullying Mariam’s son, the situation led to immense stress for both of them. In her efforts to provide comfort and security for her son, Mariam fell behind on her rent and council tax. The mounting debt and threats from enforcement agencies added to her distress. Mariam had nobody to turn for help and felt alone and scared. But then she found NZF and breathed a sigh of relief. Thanks to your Zakat, her arrears were cleared, preventing her from losing her home and alleviating the pressure from debt collectors. Today, Mariam and her son are in a much better place, both emotionally and financially. Your Zakat has given them a fresh start and renewed hope for the future. Mariam expressed immense gratitude, stating that the support has been a lifeline, enabling her to focus on her son’s wellbeing.",
            },

            zain: {
            image: "assets/stories4.png",
            title: "Zain’s life took a difficult turn when he became bedbound with kidney disease and severe gout pain, leaving him unable to work.",
            description:
                "Alongside Zain’s health challenges, the spiralling cost of living made it difficult for him to make ends meet. The benefits he received weren’t enough to cover his expenses, and he turned to credit cards to bridge the financial gap. However, he soon fell into debt after being unable to keep up with his repayments. Living alone and lacking a support network of friends and family, Zain’s circumstances were made even more difficult by the loss of his father. The weight of his challenges pushed him to a dark place, affecting not only his physical health but also his mental well-being. When Zain found NZF, he was happy and relieved to know help was available. Your Zakat helped Zain pay off his credit card debts, buy blankets to keep warm and purchase items to help manage his gout condition. Moreover, your support helped Zain feel less alone and restored his hope for the future.",
            },

            mustafa: {
                image: "assets/stories5.png",
                title: "Your Zakat gave Mustafa a stepping stone towards financial independence and helped him secure his family’s future.",
                description:
                "Mustafa – a Syrian national – came to the UK with his wife, hoping to build a new future. Despite suffering from a heart condition and going through the difficulties of adapting to a new country, Ahmad was determined to pursue his dream of becoming a pharmacist in the UK. He applied for the Overseas Pharmacists Assessment Programme (OSPAP), a full-time course that qualifies international pharmacists for UK registration. However, the costs of the course and the financial strain of daily living expenses soon began mounting up. Despite working as a trainee dispenser in a local pharmacy, Mustafa’s income was barely enough to cover his living expenses. His health condition also meant he could not take on additional work. Faced with many challenges, Mustafa had no idea how to fund his course, which would allow him to become a fully qualified pharmacist and significantly increase his income. Eventually, Mustafa came across NZF and was relieved to find help to fund his course and registration fees through the Work Fund. Your Zakat helped to ease Mustafa’s financial burden and also helped to motivate him in his journey towards becoming a qualified pharmacist in the UK. He hopes to be able to help others in the future by giving Zakat to NZF once he completes his studies.",
            },

            shereen: {
                image: "assets/stories6.png",
                title: "Your Zakat helped her avoid eviction and feel safe and cared for by her community.",
                description:
                "Shereen had always been hardworking, but despite her best efforts, she found herself in great difficulty when she fell behind on her rent. Her low-income job and the spiralling cost of living made it impossible to make ends meet. To make matters more challenging, Shereen’s residential status barred her from accessing crucial housing benefits, and with no family and friends to turn to for help, she felt very alone and overwhelmed with her situation. Shereen found herself stuck; she could neither secure government assistance nor bridge the growing gap between her income and her mounting bills. Faced with eviction, Shereen didn’t know where to turn to for help. Thankfully, she learned about NZF at her local mosque and immediately applied to the Housing Fund for help. Her application was accepted, and she received the financial support needed to avoid eviction from her home – her only place of safety and security. Your Zakat provided a lifeline for Shereen when she needed it most. Beyond the financial relief, your support reminded her that she wasn’t alone and that her community was there for her in her time of need.",
            },

            jamila: {
                image: "assets/stories7.png",
                title: "She was diagnosed with cancer, life became a huge struggle but your Zakat was here to help.",
                description:
                "Jamila came to the UK as a refugee, hoping to start a new life away from the troubles of her homeland. As a divorcee and cancer patient, she faced many difficulties, especially since she had no friends or family to help her. Her illness took a considerable toll on her mentally, physically and financially. Unable to work, she found it almost impossible to make ends meet on benefits alone. Despite her difficulties, Jamila wanted to pursue HR training to secure employment and become financially independent. She had already acquired experience and education in the field of HR in her home country but needed to undertake more training in order to work in the UK. When she came across NZF, she felt a glimmer of hope and immediately applied to the Work Fund to help fund her studies. With your Zakat, she is now pursuing her HR qualifications, which she hopes will open doors to employment, financial stability and ultimately a brighter future insha’Allah.",
            },

            layla: {
                image: "assets/stories8.png",
                title: "Your Zakat helped restore their dignity and provided them with relief when they needed it most.",
                description:
                "Layla and her husband Amaad came to the UK in search of a better life. As asylum seekers, they could not work and had to live off the small amount of support given to them by the Home Office as they awaited the outcome of their application. Two years passed, and in that time, Layla and her husband welcomed their first child. But instead of enjoying their time as new parents, they struggled to make ends meet. Overwhelmed by their circumstances, they couldn’t provide the most basic necessities for their son. As new parents, they felt hopeless and almost like they had failed their son. Zakat and its power. However, when Layla and Amaad heard about NZF, they were relieved – and surprised – to know there was an organisation in the UK that could help them with Zakat. They applied to the Hardship Fund and got help towards essentials such as baby milk and food, clothing and other items. Amaad also repaid an overdue loan, alleviating him of a burden that had loomed over him for far too long. Your Zakat helped Layla and Amaad feel closer to the Muslim community and more optimistic about the future. Your support lifted their spirits and gave them some much-needed breathing at a difficult time. In the future, Layla – who has qualifications in agriculture – hopes to be able to find a good job alongside her husband.",
            },

            saima: {
                image: "assets/stories9.png",
                title: "Life was hard as she struggled to take care of her two children on her own, but your Zakat helped to give her the new start she desperately needed.",
                description:
                "Saima left her husband with her two young children after suffering from domestic violence for nine years. Life in the women’s refuge was not without its challenges, but at least she no longer had to suffer from abuse – and her children no longer had to witness it. Saima’s youngest son has autism, and the expenses relating to the care of a special needs child soon began to add up. Saima wondered how she would ever be able to leave the shelter and start a new life on her own terms. But after securing social housing, she started to feel a glimmer of hope. Whilst she was grateful for the opportunity to have her own place, she had no furniture or appliances to make her house a home. Zakat and its power. After hearing about NZF through the shelter, Saima made an application for Zakat, which was accepted. She was so relieved to have the funds to furnish her home so that she could create a safe and comfortable environment in which to raise her children. Your Zakat supported Saima when she had nowhere to turn and served as a reminder that she was not alone in her struggle. Without worrying about their living conditions, Saima was able to focus on raising her children and starting a new chapter in her life.",
            },
            
        };
  
        // Pop-up with specific content
        const popupContent = cardContent[dataId];
        document.getElementById('popup-image').src = popupContent.image;
        document.getElementById('popup-title').textContent = popupContent.title;
        document.getElementById('popup-description').textContent = popupContent.description;
    
        // Show the pop-up
        const popupContainer = document.getElementById('popup-container');
        popupContainer.classList.add('active');
    });
});
  
// Close the pop-up
document.querySelector('.popup-close').addEventListener('click', () => {
    document.getElementById('popup-container').classList.remove('active');
});
  