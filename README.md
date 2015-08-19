# Analytics Tester (a.k.a Fake Analytics)

  Test suite for Google Analytics that replaces the original ga.js and provide some useful methods for testing purposes.

## Dependencies
  1. Capybara
  2. Selenium Webdriver

## How to use

   Include **ga.js** in the project (e.g. features/lib folder)

### Creating a test case

````
  # initializing analytics faker
  before do
    proxy.stub('http://www.google-analytics.com/ga.js').and_return(
      content_type: "application/javascript",
        body: File.read("features/lib/ga.js")
    )

    #Use *visit* from capybara to reach the page you want to test
    visit url
    sleep 1
  end

  let(:url) { "http://test.org" }
  let(:trackers) { ["a", "b"] }

  context "Event 1" do
    before do
     let(:params) = { [10, "Test"] }
    end

    it "should aet custom var once" do
      tracker.each do |tracker|
        # get the account from analytics tester using capybara's evaluate_script
        account = page.evaluate_script("AnalyticsTester.accounts['#{tracker}']")
        # you can access the events of the account
        # for example, if you want all of the customVar of an account
        account(['events']).select! { |event| event["action"] == _setCustomVar && event["params"] == params }
        expect(account["events"].size).to eql(1)
      end      
    end
  end
````




## Contributors

  - [Celio Latorraca](https://github.com/celiofonseca)
