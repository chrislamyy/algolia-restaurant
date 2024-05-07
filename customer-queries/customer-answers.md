## Question 1

Hi George,

Thanks for your email.

Navigating search engines can be tricky at first but I'll be happy to help!

Records in Algolia are essentially a collection of attributes whereby each attribute has a name and a value i.e key-value pair. A simple example in the context of clothing items can be:

{

"type": "T-shirt",

"name": "plain T-shirt""price": 30,

"inventory": 1000,

"sku": "TSHIRT-000001"

}

Indexing involves adding records to the search engine's index which is a structured database optimised for fast search and discovery operations.

For custom ranking, any boolean or numeric attribute can be used. Some commonly used ones can be the number of sales and or recently added. Continuing with the clothing example, you could create a custom ranking based on inventory to improve inventory turnover ratios.

I've added some useful links to our documentation if you would like to go a little deeper.

Useful Links

Algolia records:

<https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/#algolia-records>

Indexing your data:

<https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/#index-your-data-without-coding>

Custom Ranking

<https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking/>

Don't hesitate to reach out if you have any other questions.

Best,

Chris

## Question 2

Hi Matt,

Thanks for reaching out and expressing your concerns, it's always helpful getting customers candid feedback.

I understand the process of clearing out indexes and or deleting them can be quite a cumbersome task especially if you have many indices. Unfortunately as of right now the only methods available are through the user interface (UI) or API.

However the API route provides more flexibility if you wish to avoid the lengthy process within the UI. I've attached 2 sample scripts - one for deleting indices and another for clearing them. Feel free to explore them if you're comfortable with a bit of coding.

Here is a helpful link for the API - <https://www.algolia.com/doc/guides/sending-and-managing-data/manage-indices-and-apps/manage-indices/how-to/delete-indices/#delete-indices-with-the-api>

Rest assured, I will relay your feedback to the product team and will keep you posted on any developments.

Please reach out if you have any other questions.

Thanks,

Chris

[Link to attached scripts](../scripts/customer)

## Question 3

Hi Leo,

Great to hear you are exploring options to integrate Algolia in your website! I'll be happy to give you a brief breakdown of what the process might look like.

As with all vendors integrating with Algolia can vary in terms of complexity based on several factors such as size of your data set, complexity of your search requirements and familiarity with web development and Algolia APIs.

The main process is as follows assuming you have already signed up for an Algolia account.

1.  Define data

Determine the structure of your data and decide which attributes are most relevant to your search and discovery experience.

2.  Import data

Populate the Algolia index with your data. Choose from a variety of import methods tailored to your needs.

3.  Integrating Algolia Search on your Website

Using Algolia's APIs or SDKs to integrate search functionality. We provide a range of client libraries for most popular programming languages.

4.  Configuring Search Relevance

This can be an iterative step whereby you may fine tune several search configurations to optimise your search relevance for your users.

5.  Monitoring

Keep an eye out on search analytics using our reports and dashboards. Insights can be used to further improve search relevance and enhance search experience for your users. Can be used in conjunction with step 4 (Configuring Search Relevance).

Here is a helpful getting started guide if you wish to dig a little deeper <https://www.algolia.com/doc/guides/getting-started/quick-start/> .

As always, if you have any questions or concerns feel free to reach out!

Thanks,

Chris
