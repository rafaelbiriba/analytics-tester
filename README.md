# Analytics Tester (a.k.a Fake Analytics)

  Test suite for Google Analytics that replaces the original ga.js and provide some useful methods for testing purposes.

## Examples

### Creating a test case using capybara

#### How to use
   Include **ga.js** in the project (e.g. features/lib folder)

``` ruby
  # initializing analytics faker
  before do
    proxy.stub('http://www.google-analytics.com/ga.js').and_return(
      content_type: "application/javascript",
        body: File.read("features/lib/ga.js")
    )

    #Use *visit* from capybara to reach the page you want to test
    visit "http://test.org" 
  end


  context "Event 1" do
    before do
      let(:params) = { [10, "Test"] }
      let(:trackers) { ["a", "b"] }
    end

    it "should track custom var once" do
      tracker.each do |tracker|
        # get the account from analytics tester using capybara's evaluate_script
        account = page.evaluate_script("AnalyticsTester.accounts['#{tracker}']")
        # you can access the events of the account
        # for example, if you want all of the customVar of an account
        account['events'].select! { |event| event["action"] == "_setCustomVar" && event["params"] == params }
        expect(account["events"].size).to eql(1)
      end      
    end
  end
```

### Supported Events

  1. _trackPageView
  2. _trackEvent
  3. _setCustomVar

### Supported Metadatas

  You can also set UA account, cookie path and domain name using **_setAccount**, **_setCookiePath** and **_setDomainName**.

## Contributors

  - [Celio Latorraca](https://github.com/celiofonseca)
  - [Bernardo Lins](https://github.com/bernardolins)
